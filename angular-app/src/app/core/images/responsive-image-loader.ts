import { ImageLoaderConfig } from '@angular/common';

/**
 * Loader customizado do `NgOptimizedImage` (26/09/2026, achado do Johnny ao perguntar sobre
 * compactação de imagem): sem loader nenhum configurado, `ngSrcset="528w, 704w, 880w"` só
 * anexaria `?w=528` na mesma URL (`ngSrc="...jpg" ngSrcset="100w"` -> `srcset="...jpg?w=100
 * 100w"`, doc oficial do Angular) - inútil aqui, o site é 100% estático (Vercel serve o
 * arquivo tal e qual, ignora query string). Sem CDN de imagem (Cloudinary/Imgix/etc.), a única
 * forma de servir arquivos DE VERDADE menores por largura é mapear manualmente pros arquivos
 * já gerados por `scripts/optimize-images.mjs`/`image-targets.mjs`.
 *
 * Só o `about.html` usa isso hoje - é a única seção cujo container muda de tamanho por
 * breakpoint (`about.scss`: 264x312 mobile / 352x416 tablet / 440x520 desktop). As outras
 * (Hero, avatares de depoimento, logos) têm tamanho fixo em todas as telas, não precisam de
 * variante nenhuma - por isso o mapa abaixo só tem uma entrada. Qualquer imagem fora do mapa
 * (a maioria) passa direto, sem alteração.
 */
const RESPONSIVE_VARIANTS: Readonly<Record<string, Readonly<Record<number, string>>>> = {
  'assets/images/photo_about_02.webp': {
    528: 'assets/images/photo_about_02-528w.webp',
    704: 'assets/images/photo_about_02-704w.webp',
    // 880w é o arquivo base (photo_about_02.webp) - já é o que `src`/`ngSrc` aponta,
    // não precisa de entrada aqui (ver `responsiveImageLoader` abaixo).
  },
};

export function responsiveImageLoader({ src, width }: ImageLoaderConfig): string {
  const variant = width !== undefined ? RESPONSIVE_VARIANTS[src]?.[width] : undefined;
  return variant ?? src;
}
