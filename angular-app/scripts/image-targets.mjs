// Configuracao pura (sem efeitos colaterais - so dados) do pipeline de otimizacao de imagens.
// Separada de `optimize-images.mjs` pra poder ser importada pelo teste
// (`src/asset-sizes.spec.ts`) sem disparar o processamento de verdade (que roda com efeitos
// colaterais - grava arquivo - assim que o modulo `optimize-images.mjs` e importado).
//
// Tamanho-alvo = ~2x o maior tamanho exibido em tela (retina-ready), a mesma recomendacao do
// Chrome/web.dev pra imagens responsivas. `quality` e o parametro do encoder (JPEG/WebP;
// ignorado pra PNG, que usa paleta de cores). `output` pode trocar a extensao (ex.: PNG de
// foto -> JPEG/WebP). `fit` (26/09/2026, corrige bug achado pelo Johnny - os logos da Totvs e
// da Coca-Cola FEMSA saiam cortados, nao redimensionados): 'cover' (padrao, cropa pra preencher
// o quadro exato - certo pra fotos que usam `object-fit: cover` no CSS, tipo Hero/About/avatar
// de depoimento) ou 'inside' (encolhe preservando a imagem INTEIRA, sem cortar nada - certo pra
// logos que usam `object-fit: contain` no CSS, tipo Totvs/Coca-Cola FEMSA - um logo cortado
// perde conteudo real, ao contrario de uma foto que aguenta perder borda).

export const TARGETS = [
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
    // Experience (experience.ts) - `object-fit: contain` (experience.scss), logo com aspect
    // ratio bem largo (3020x915 no original) - 'inside' preserva a proporcao real, sem cortar
    // texto/marca nas bordas. Com `fit: 'inside'` numa caixa 200x60, a proporcao real do
    // logo (3020x915) fecha a altura primeiro - resultado real e 198x60, nao 200x60. Numeros
    // abaixo refletem a saida de verdade (`npm run optimize-images` imprime pra conferir).
    source: 'logo_totvs.jpg',
    output: 'logo_totvs.jpg',
    width: 198,
    height: 60,
    fit: 'inside',
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
    // Project (project.ts) - `object-fit: contain` (project.scss), mesmo motivo do Totvs
    // acima: 'inside' preserva a proporcao real do logo (600x343 no original), sem cortar.
    // width/height la ajustados pra bater com essa proporcao (560x320).
    source: 'logo_project_coca-cola_femsa.png',
    output: 'logo_project_coca-cola_femsa.png',
    width: 560,
    height: 320,
    fit: 'inside',
    format: 'png',
  },
];

/**
 * Copia extra: og:image (index.html) usa uma copia JPEG dedicada da foto da Hero, nao o
 * `.webp` da pagina - crawlers de preview social (WhatsApp, LinkedIn, Facebook) tem suporte
 * inconsistente a WebP nesse contexto. Gerada a partir do mesmo original em alta resolucao,
 * no mesmo tamanho da versao usada na pagina.
 */
export const OG_COPIES = [
  {
    source: 'profile_johnnysouto.jpeg',
    output: 'profile_johnnysouto_og.jpeg',
    width: 1064,
    height: 1064,
    format: 'jpeg',
    quality: 85,
  },
];

/**
 * Teto de tamanho de arquivo por categoria (`asset-sizes.spec.ts`) - nao e o tamanho exato
 * esperado (isso já é a checagem de dimensoes/pixels), e sim um limite de bom senso pra pegar
 * uma regressao de qualidade/compactacao (ex.: alguem sobe um `quality` muito alto sem
 * perceber o impacto). Numeros folgados em cima do que o pipeline entrega hoje.
 */
export const MAX_BYTES_BY_OUTPUT = {
  'profile_johnnysouto.webp': 100 * 1024,
  'photo_about_02.webp': 250 * 1024,
  'logo_totvs.jpg': 15 * 1024,
  'profile_testmonial_02.jpg': 15 * 1024,
  'profile_testmonial_03.jpeg': 15 * 1024,
  'profile_testmonial_04.jpeg': 15 * 1024,
  'logo_project_coca-cola_femsa.png': 30 * 1024,
  'profile_johnnysouto_og.jpeg': 150 * 1024,
};
