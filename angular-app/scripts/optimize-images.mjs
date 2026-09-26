// Otimiza imagens estaticas do site: le os originais em alta resolucao de `src/assets/images/`
// (nunca servidos - `angular.json` so copia `public/` pro build, ver `assets`) e gera as
// versoes redimensionadas/recomprimidas em `public/assets/images/` (essas sim, servidas).
//
// Existe porque duas rodadas manuais de otimizacao (26/09/2026, achado do PageSpeed Insights -
// LCP de 11,4s por imagens 3-17x maiores em pixels do que o espaco onde aparecem na tela)
// descobriram o mesmo problema duas vezes, cada vez reprocessando arquivos que ja tinham
// perda (JPEG/WebP re-recomprimido perde qualidade a cada rodada - "generation loss"). Este
// script parte sempre do arquivo original (alta resolucao, sem perda anterior) e centraliza
// numa unica tabela (`image-targets.mjs`) o tamanho-alvo de cada imagem, que hoje esta
// espalhado pelos componentes (hero.html, about.html, experience.ts, testimonials.html).
//
// Uso: adiciona/atualiza o arquivo original em `src/assets/images/`, ajusta ou adiciona uma
// entrada em `image-targets.mjs`. Roda sozinho (26/09/2026) como parte do `npm run build`
// ("build": "node scripts/optimize-images.mjs && ng build") - garante que o `public/` que vai
// pro deploy da Vercel esteja sempre em sincronia com `src/assets/images/`, mesmo se alguem
// esquecer de rodar manualmente (o CI/CD deste projeto nao roda `ng test` antes do deploy, ver
// Production.yaml/Develop.yaml - so validacao de branch, auditoria de seguranca e deploy).
// `asset-sizes.spec.ts` complementa com visibilidade no `ng test` local.
import sharp from 'sharp';
import { existsSync, statSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OG_COPIES, TARGETS } from './image-targets.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SOURCE_DIR = resolve(root, 'src/assets/images');
const OUTPUT_DIR = resolve(root, 'public/assets/images');

async function process({ source, output, width, height, format, quality }) {
  const src = resolve(SOURCE_DIR, source);
  const dst = resolve(OUTPUT_DIR, output);

  if (!existsSync(src)) {
    console.warn(`⚠ original ausente, pulando: src/assets/images/${source}`);
    return;
  }

  const before = existsSync(dst) ? statSync(dst).size : 0;

  let pipeline = sharp(src).resize(width, height, { fit: 'cover' });
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality });
  } else if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, progressive: true, mozjpeg: true });
  } else if (format === 'png') {
    pipeline = pipeline.png({ palette: true, quality: 90 });
  }
  await pipeline.toFile(dst);

  // Troca de extensao (ex.: .png -> .jpg): remove o arquivo antigo em public/, se existir.
  if (source !== output) {
    const staleOutput = resolve(OUTPUT_DIR, source);
    if (existsSync(staleOutput) && staleOutput !== dst) {
      await unlink(staleOutput);
    }
  }

  const after = statSync(dst).size;
  const arrow = before ? `${(before / 1024).toFixed(0)}KB -> ` : '';
  console.log(
    `${source} -> ${output}: ${arrow}${(after / 1024).toFixed(0)}KB (${width}x${height})`,
  );
}

for (const target of TARGETS) {
  await process(target);
}
for (const target of OG_COPIES) {
  await process(target);
}
