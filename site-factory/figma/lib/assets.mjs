// Planejamento da exportacao de assets: valida o manifesto e agrupa os pedidos por formato e escala
// (a API de imagens do Figma recebe um formato por chamada). Sem rede e sem disco: so decisao.
export const FORMATS = ['svg', 'png', 'jpg'];
const MAX_IDS_PER_CALL = 40;
const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const NODE = /^I?\d+:\d+(;\d+:\d+)*$/;

// Devolve { assets, errors }. Cada asset: { id, node, category, format, scale, file }.
export function parseManifest(manifest) {
  const errors = [];
  const list = Array.isArray(manifest?.assets) ? manifest.assets : null;
  if (!list) return { assets: [], errors: ['manifesto sem a lista "assets"'] };
  const seen = new Set();
  const assets = [];
  for (const [i, raw] of list.entries()) {
    const where = `assets[${i}]${raw?.id ? ` (${raw.id})` : ''}`;
    const format = raw.format ?? 'svg';
    const scale = raw.scale ?? (format === 'svg' ? 1 : 2);
    if (!SLUG.test(raw.id ?? '')) errors.push(`${where}: id deve ser minusculo com hifen (ex.: logo-branco)`);
    if (!NODE.test(raw.node ?? '')) errors.push(`${where}: node invalido "${raw.node}" (esperado 123:456)`);
    if (!SLUG.test(raw.category ?? '')) errors.push(`${where}: category deve ser minuscula com hifen (ex.: icons, logos, images)`);
    if (!FORMATS.includes(format)) errors.push(`${where}: formato "${format}" fora de ${FORMATS.join('/')}`);
    if (!(scale >= 0.5 && scale <= 4)) errors.push(`${where}: scale deve ficar entre 0.5 e 4`);
    const file = `${raw.category}/${raw.id}.${format}`;
    if (seen.has(file)) errors.push(`${where}: arquivo duplicado ${file}`);
    seen.add(file);
    assets.push({ id: raw.id, node: raw.node, category: raw.category, format, scale, file });
  }
  return { assets, errors };
}

// Pedidos para a API: um por (formato, escala), com os ids em lotes.
export function planCalls(assets) {
  const groups = new Map();
  for (const a of assets) {
    const key = `${a.format}@${a.format === 'svg' ? 1 : a.scale}`;
    if (!groups.has(key)) groups.set(key, { format: a.format, scale: a.format === 'svg' ? 1 : a.scale, assets: [] });
    groups.get(key).assets.push(a);
  }
  return [...groups.values()].flatMap((g) => {
    const batches = [];
    for (let i = 0; i < g.assets.length; i += MAX_IDS_PER_CALL) batches.push({ format: g.format, scale: g.scale, assets: g.assets.slice(i, i + MAX_IDS_PER_CALL) });
    return batches;
  });
}
