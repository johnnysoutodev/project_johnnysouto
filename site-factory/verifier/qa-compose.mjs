// Monta, para cada secao, uma imagem unica com o Figma (esquerda) e o site renderizado (direita), para o dono ver as duas lado a lado.
// Uso: node site-factory/verifier/qa-compose.mjs --ref <pasta com <secao>.png do Figma> --shots <pasta com <secao>.png do site> --out <pasta>
//   [--sections a,b] [--bg '#ffffff']   saida: <out>/<secao>-lado-a-lado.png
// Usa o Chrome do verifier (sem dependencia nova). Os PNGs do Figma tem fundo transparente: o fundo da montagem (--bg) deve ser o do tema
// da variante (branco no claro, escuro no dark), senao o texto some. Uma linha separa o Figma (esquerda) do site (direita).
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const [refDir, shotDir, outDir] = ['ref', 'shots', 'out'].map((n) => opt(n) && resolve(opt(n)));
const bg = /^#[0-9a-f]{3,8}$/i.test(opt('bg') ?? '') ? opt('bg') : '#ffffff';
if (!refDir || !shotDir || !outDir) {
  console.error('Uso: node qa-compose.mjs --ref <pasta> --shots <pasta> --out <pasta> [--sections a,b]');
  process.exit(2);
}
for (const d of [refDir, shotDir]) if (!existsSync(d)) { console.error(`pasta nao encontrada: ${d}`); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const ids = (opt('sections')?.split(',') ?? readdirSync(shotDir).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)));
const dataUri = (file) => `data:image/png;base64,${readFileSync(file).toString('base64')}`;
const browser = await chromium.launch({ channel: 'chrome' });
let missing = 0;
for (const id of ids) {
  const ref = join(refDir, `${id}.png`);
  const shot = join(shotDir, `${id}.png`);
  if (!existsSync(ref) || !existsSync(shot)) {
    console.log(`FALTA  ${id} (${!existsSync(ref) ? 'referencia do Figma' : 'captura do site'} nao existe)`);
    missing++;
    continue;
  }
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  await page.setContent(`<body style="margin:0;background:${bg};display:flex;align-items:flex-start;width:max-content"><img id="a" src="${dataUri(ref)}"><div style="align-self:stretch;width:3px;background:#ff5a1f"></div><img id="b" src="${dataUri(shot)}"></body>`);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  await page.screenshot({ path: join(outDir, `${id}-lado-a-lado.png`), fullPage: true });
  await page.close();
  console.log(`OK     ${id}  -> ${join(outDir, `${id}-lado-a-lado.png`)}`);
}
await browser.close();
if (missing) process.exit(1);
