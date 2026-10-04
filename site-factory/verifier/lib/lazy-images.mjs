// Imagens `loading="lazy"` (o padrao do NgOptimizedImage) so carregam quando chegam perto da janela. Sem rolar a pagina:
//  - o screenshot de pagina inteira sai com buracos no lugar das imagens;
//  - o check de imagem quebrada (`complete && naturalWidth === 0`) nao enxerga as que nem comecaram a carregar e passa em falso.
// `primeLazyImages` rola a pagina inteira em passos e espera as imagens terminarem; `unloadedImages` lista as que continuam
// sem carregar e que o usuario veria (as escondidas por CSS, como a variante de outro viewport, nao contam).

export async function primeLazyImages(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(200, Math.round(innerHeight * 0.5));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await wait(120);
    }
    scrollTo(0, document.documentElement.scrollHeight);
    // So espera as que o usuario veria: uma imagem escondida por CSS (variante de outro viewport) nunca carrega.
    const pending = [...document.images].filter((i) => !i.complete && getComputedStyle(i).display !== 'none' && i.getBoundingClientRect().width > 0);
    await Promise.race([
      Promise.all(pending.map((i) => new Promise((resolve) => { i.addEventListener('load', resolve, { once: true }); i.addEventListener('error', resolve, { once: true }); }))),
      wait(5000),
    ]);
    scrollTo(0, 0);
    await wait(50);
  });
}

// Imagens visiveis que nao carregaram: quebradas (terminaram sem dimensao) ou que ficaram pendentes mesmo depois de rolar.
export async function unloadedImages(page) {
  return page.evaluate(() => [...document.images]
    .filter((i) => i.naturalWidth === 0)
    .filter((i) => {
      const cs = getComputedStyle(i);
      const hidden = cs.display === 'none' || cs.visibility === 'hidden' || !!i.closest('[hidden]') || (!i.complete && i.getBoundingClientRect().width === 0);
      return !hidden;
    })
    .map((i) => `${i.currentSrc || i.src || i.getAttribute('src')}${i.complete ? '' : ' (nao terminou de carregar)'}`));
}
