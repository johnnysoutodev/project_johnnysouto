// Otimiza imagens estaticas do site: le os originais em alta resolucao de `src/assets/images/`
// (nunca servidos - `angular.json` so copia `public/` pro build, ver `assets`) e gera as
// versoes redimensionadas/recomprimidas em `public/assets/images/` (essas sim, servidas).
//
// Existe porque duas rodadas manuais de otimizacao (26/09/2026, achado do PageSpeed Insights -
// LCP de 11,4s por imagens 3-17x maiores em pixels do que o espaco onde aparecem na tela)
// descobriram o mesmo problema duas vezes, cada vez reprocessando arquivos que ja tinham
// perda (JPEG/WebP re-recomprimido perde qualidade a cada rodada - "generation loss"). Este
// script parte sempre do arquivo original (alta resolucao, sem perda anterior) e centraliza
// numa unica tabela (`TARGETS`) o tamanho-alvo de cada imagem, que hoje esta espalhado pelos
// componentes (hero.html, about.html, experience.ts, testimonials.html).
//
// Uso: adiciona/atualiza o arquivo original em `src/assets/images/`, ajusta ou adiciona uma
// entrada em `TARGETS` abaixo, roda `npm run optimize-images`. Nao roda automaticamente no
// build (as saidas ficam commitadas no git, revisaveis num diff comum).
import sharp from 'sharp';
import { existsSync, statSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SOURCE_DIR = resolve(root, 'src/assets/images');
const OUTPUT_DIR = resolve(root, 'public/assets/images');

/**
 * Tamanho-alvo = ~2x o maior tamanho exibido em tela (retina-ready), a mesma recomendacao do
 * Chrome/web.dev pra imagens responsivas. `quality` e o parametro do encoder (JPEG/WebP;
 * ignorado pra PNG, que usa paleta de cores via `pngQuality`). `output` pode trocar a
 * extensao (ex.: PNG de foto -> JPEG/WebP).
 */
const TARGETS = [
  {
    // Hero (hero.html) - e a propria imagem LCP do site.
    source: 'profile_johnnysouto.jpeg',
    output: 'profile_johnnysouto.webp',
    width: 1064,
    height: 1064,
    format: 'webp',
    quality: 75,
  },
  {
    // About (about.html).
    source: 'photo_about_02.jpeg',
    output: 'photo_about_02.webp',
    width: 784,
    height: 1394,
    format: 'webp',
    quality: 72,
  },
  {
    // Experience (experience.ts) - width/height declarados la sao 200x112 (2x de 100x56).
    source: 'logo_totvs.jpg',
    output: 'logo_totvs.jpg',
    width: 200,
    height: 112,
    format: 'jpeg',
    quality: 82,
  },
  {
    // Testimonials (testimonials.html) - avatar exibido a 64x64. Era PNG (foto sem
    // transparencia real salva por engano); vira JPEG.
    source: 'profile_testmonial_02.png',
    output: 'profile_testmonial_02.jpg',
    width: 128,
    height: 128,
    format: 'jpeg',
    quality: 82,
  },
  {
    source: 'profile_testmonial_03.jpeg',
    output: 'profile_testmonial_03.jpeg',
    width: 128,
    height: 128,
    format: 'jpeg',
    quality: 82,
  },
  {
    source: 'profile_testmonial_04.jpeg',
    output: 'profile_testmonial_04.jpeg',
    width: 128,
    height: 128,
    format: 'jpeg',
    quality: 82,
  },
  {
    // Project (project.ts) - width/height declarados la sao 280x100; alvo em 2x.
    source: 'logo_project_coca-cola_femsa.png',
    output: 'logo_project_coca-cola_femsa.png',
    width: 560,
    height: 200,
    format: 'png',
  },
];

/**
 * Copia extra: og:image (index.html) usa uma copia JPEG dedicada da foto da Hero, nao o
 * `.webp` da pagina - crawlers de preview social (WhatsApp, LinkedIn, Facebook) tem suporte
 * inconsistente a WebP nesse contexto. Gerada a partir do mesmo original em alta resolucao,
 * no mesmo tamanho da versao usada na pagina.
 */
const OG_COPIES = [
  {
    source: 'profile_johnnysouto.jpeg',
    output: 'profile_johnnysouto_og.jpeg',
    width: 1064,
    height: 1064,
    format: 'jpeg',
    quality: 85,
  },
];

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
