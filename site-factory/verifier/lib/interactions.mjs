// Smoke de interacao generico: exercita o que o DOM declara como interativo (aria-expanded/aria-controls, aria-pressed, ancoras,
// indicador de foco), sem seletores do site. Cada achado e um defeito observavel, nao uma opiniao de design.
//   - disclosure/menu/dialogo: clicar abre (aria-expanded, painel visivel); dialogo modal move e prende o foco; Escape fecha e devolve o foco;
//     painel fechado nao recebe foco pelo Tab (classe do bug "focus() em elemento inert" e de painel escondido ainda focavel);
//   - botoes aria-pressed: clicar inverte o estado;
//   - ancoras internas (#id): o alvo existe e o clique leva a ele;
//   - indicador de foco: cada elemento alcancado pelo Tab mostra algum indicador visivel (outline ou sombra).

const ANIMATION_MS = 500;

// Estado do gatilho e do painel que ele controla, lido de dentro da pagina.
function readState(triggerSelector) {
  const t = document.querySelector(triggerSelector);
  const panel = t ? document.getElementById(t.getAttribute('aria-controls')) : null;
  const visible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.01 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight;
  };
  const active = document.activeElement;
  const dialog = panel && (panel.matches('[role="dialog"],[aria-modal="true"]') ? panel : panel.querySelector('[role="dialog"],[aria-modal="true"]'));
  return {
    expanded: t?.getAttribute('aria-expanded'),
    panelVisible: visible(dialog ?? panel),
    modal: !!dialog,
    menuLike: !!panel && (!!dialog || /menu|listbox/.test(`${panel.getAttribute('role')} ${t.getAttribute('aria-haspopup')}`)),
    inert: !!(dialog ?? panel)?.closest('[inert]'),
    focusInside: !!panel && !!active && panel.contains(active),
    focusOnTrigger: !!active && (active === t || t.contains(active)),
    activeName: active && active !== document.body ? `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ''}` : 'body',
  };
}

async function waitSettle(page) {
  await page.waitForTimeout(ANIMATION_MS);
}

// Teclas Tab ate `n` vezes; devolve para cada parada se o foco esta dentro do painel.
async function tabPositions(page, triggerSelector, n) {
  const seen = [];
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab');
    seen.push(await page.evaluate((sel) => {
      const t = document.querySelector(sel);
      const panel = t ? document.getElementById(t.getAttribute('aria-controls')) : null;
      const a = document.activeElement;
      return { inside: !!panel && !!a && panel.contains(a), name: a && a !== document.body ? `${a.tagName.toLowerCase()}${a.id ? `#${a.id}` : ''}` : 'body' };
    }, triggerSelector));
  }
  return seen;
}

export async function runInteractions(page, tag, problems) {
  const triggers = await page.$$eval('[aria-expanded][aria-controls]', (els) => els.map((el, i) => {
    el.setAttribute('data-smoke-trigger', String(i));
    return { sel: `[data-smoke-trigger="${i}"]`, name: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label').slice(0, 30)}]` : ''}` };
  }));

  for (const { sel, name } of triggers) {
    const handle = await page.$(sel);
    if (!handle || !(await handle.isVisible())) continue; // gatilho que nao existe neste viewport (ex.: menu mobile no desktop)
    const before = await page.evaluate(readState, sel);
    if (before.expanded === 'true') continue; // ja aberto por padrao: nao e o caso deste smoke
    try {
      await handle.scrollIntoViewIfNeeded({ timeout: 2000 });
      await handle.click({ timeout: 3000 });
    } catch (e) {
      problems.toggles.push(`${tag}: ${name} nao pode ser clicado (${String(e.message).split('\n')[0].slice(0, 90)})`);
      continue;
    }
    await waitSettle(page);
    const open = await page.evaluate(readState, sel);

    if (open.expanded !== 'true') problems.toggles.push(`${tag}: ${name}: clique nao mudou aria-expanded para "true" (ficou "${open.expanded}")`);
    else if (!open.panelVisible) problems.toggles.push(`${tag}: ${name}: aria-expanded="true" mas o painel controlado nao esta visivel`);
    else {
      if (open.modal && open.inert) problems.toggles.push(`${tag}: ${name}: dialogo aberto continua dentro de um ancestral inert`);
      if (open.modal && !open.focusInside) problems.toggles.push(`${tag}: ${name}: dialogo modal abriu mas o foco nao entrou nele (foco em ${open.activeName}); tipico de focus() chamado antes de o painel deixar de ser inert`);
      if (open.modal && open.focusInside) {
        const stops = await tabPositions(page, sel, 12);
        const escaped = stops.find((s) => !s.inside);
        if (escaped) problems.toggles.push(`${tag}: ${name}: o foco escapou do dialogo modal com Tab (foi para ${escaped.name})`);
      }
    }

    // Fechar: Escape para dialogo/menu; segundo clique para os demais (acordeao).
    if (open.expanded === 'true') {
      if (open.menuLike) {
        await page.keyboard.press('Escape');
        await waitSettle(page);
        const closed = await page.evaluate(readState, sel);
        if (closed.expanded !== 'false') problems.toggles.push(`${tag}: ${name}: Escape nao fechou o ${open.modal ? 'dialogo' : 'menu'} (aria-expanded="${closed.expanded}")`);
        else if (!closed.focusOnTrigger) problems.toggles.push(`${tag}: ${name}: depois de fechar com Escape o foco nao voltou ao gatilho (foi para ${closed.activeName})`);
      } else {
        await handle.click({ timeout: 3000 }).catch(() => {});
        await waitSettle(page);
        const closed = await page.evaluate(readState, sel);
        if (closed.expanded !== 'false') problems.toggles.push(`${tag}: ${name}: segundo clique nao recolheu (aria-expanded="${closed.expanded}")`);
      }
      // Painel fechado nao pode receber foco.
      const after = await page.evaluate(readState, sel);
      if (after.expanded === 'false') {
        await page.evaluate((s) => document.querySelector(s)?.focus(), sel);
        const stops = await tabPositions(page, sel, 8);
        const trapped = stops.find((s) => s.inside);
        if (trapped) problems.toggles.push(`${tag}: ${name}: painel fechado ainda recebe foco pelo Tab (${trapped.name})`);
      }
    }
  }

  // aria-pressed: clicar inverte o estado.
  const pressed = await page.$$eval('button[aria-pressed]', (els) => els.map((el, i) => {
    el.setAttribute('data-smoke-pressed', String(i));
    return { sel: `[data-smoke-pressed="${i}"]`, name: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label').slice(0, 30)}]` : ''}` };
  }));
  for (const { sel, name } of pressed) {
    const h = await page.$(sel);
    if (!h || !(await h.isVisible())) continue;
    const a = await h.getAttribute('aria-pressed');
    try { await h.click({ timeout: 3000 }); } catch { continue; }
    await page.waitForTimeout(150);
    const b = await h.getAttribute('aria-pressed');
    if (a === b) problems.toggles.push(`${tag}: ${name}: clique nao inverteu aria-pressed (continua "${a}")`);
    await h.click({ timeout: 3000 }).catch(() => {});
  }

  // Recarrega a pagina: um painel que ficou aberto por causa de um defeito acima cobriria os links e geraria falhas em cascata.
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Ancoras internas: alvo existe e o clique leva a ele.
  const anchors = await page.$$eval('a[href^="#"]', (els) => [...new Map(els.filter((a) => a.getAttribute('href').length > 1).map((a) => [a.getAttribute('href'), a])).entries()].map(([href], i) => ({ href, i })));
  for (const { href } of anchors) {
    const id = decodeURIComponent(href.slice(1));
    const exists = await page.evaluate((i) => !!document.getElementById(i), id);
    if (!exists) {
      problems.anchors.push(`${tag}: link ${href} aponta para um id que nao existe na pagina`);
      continue;
    }
    const link = await page.$(`a[href="${href}"]`);
    if (!link || !(await link.isVisible())) continue;
    try {
      await link.scrollIntoViewIfNeeded({ timeout: 2000 });
      await link.click({ timeout: 3000 });
    } catch (e) {
      problems.anchors.push(`${tag}: link ${href} nao pode ser clicado (${String(e.message).split('\n')[0].slice(0, 90)})`);
      continue;
    }
    // Rolagem suave: espera o topo do alvo ESTABILIZAR (3 amostras iguais, no maximo 6s) em vez de um tempo fixo,
    // que acusaria o site por animacao lenta sob carga.
    let top;
    let stable = 0;
    let last = null;
    for (let t = 0; t < 40 && stable < 3; t++) {
      await page.waitForTimeout(150);
      top = await page.evaluate((i) => { const r = document.getElementById(i).getBoundingClientRect(); return { top: Math.round(r.top), vh: innerHeight, h: Math.round(r.height) }; }, id);
      stable = top.top === last ? stable + 1 : 0;
      last = top.top;
    }
    if (top.top > top.vh * 0.6 || top.top + top.h < 0) problems.anchors.push(`${tag}: clicar em ${href} nao levou ao alvo (topo do alvo em ${top.top}px, janela de ${top.vh}px)`);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(200);
  }
}

// Indicador de foco (WCAG 2.4.7): percorre o Tab e confere se cada parada tem outline ou sombra. Aviso, nao falha.
export async function runFocusIndicator(page, tag, sink) {
  await page.evaluate(() => { document.activeElement?.blur?.(); scrollTo(0, 0); });
  const seen = new Set();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 && cs.outlineColor !== 'rgba(0, 0, 0, 0)';
      const shadow = cs.boxShadow && cs.boxShadow !== 'none';
      const key = `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}|${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 24)}`;
      const rect = el.getBoundingClientRect();
      return { key, ok: outline || shadow, visible: rect.width > 0 && rect.height > 0 };
    });
    if (!r) continue;
    if (seen.has(r.key)) break;
    seen.add(r.key);
    if (r.visible && !r.ok) sink.push(`${tag}: ${r.key} recebe foco sem outline nem sombra visiveis`);
  }
}
