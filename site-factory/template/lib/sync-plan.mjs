// Decisao do sync (sem disco): o que copiar, o que mudou e o que remover para o repositorio do template ficar IDENTICO a exportacao.
// Os arquivos sao listados como caminhos relativos com "/" e um resumo (hash/conteudo) para detectar mudanca.
// `keep`: prefixos do destino que o sync nunca toca (o historico do git e as dependencias instaladas).
export const KEEP = ['.git/', 'node_modules/', 'site-factory/spec/node_modules/', 'site-factory/verifier/node_modules/'];

const kept = (file, keep) => keep.some((k) => file === k.replace(/\/$/, '') || file.startsWith(k));

// exported / target: Map<caminho, digest>.
export function planSync(exported, target, keep = KEEP) {
  const added = [];
  const changed = [];
  const unchanged = [];
  for (const [file, digest] of exported) {
    if (!target.has(file)) added.push(file);
    else if (target.get(file) !== digest) changed.push(file);
    else unchanged.push(file);
  }
  const removed = [...target.keys()].filter((file) => !exported.has(file) && !kept(file, keep));
  const sort = (list) => list.sort((a, b) => a.localeCompare(b));
  return { added: sort(added), changed: sort(changed), unchanged: sort(unchanged), removed: sort(removed) };
}

// O destino e aceitavel se existe, nao e o proprio repositorio-fonte e e um repositorio git (ou esta vazio).
export function checkTarget({ target, source, exists, isGit, isEmpty }) {
  if (!exists) return 'o destino nao existe';
  if (target === source) return 'o destino e o proprio repositorio-fonte';
  if (target.startsWith(`${source}/`)) return 'o destino esta dentro do repositorio-fonte';
  if (!isGit && !isEmpty) return 'o destino nao e um repositorio git nem esta vazio (crie com git init antes)';
  return null;
}
