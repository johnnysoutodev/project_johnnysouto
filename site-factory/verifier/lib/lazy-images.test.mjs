// Rodar: node --test site-factory/verifier/lib/lazy-images.test.mjs   (precisa do Chrome, como o verifier)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { chromium } from 'playwright-core';
import { primeLazyImages, unloadedImages } from './lazy-images.mjs';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const PAGE = `<!doctype html><body style="margin:0">
<div style="height:4000px"></div>
<img id="ok" loading="lazy" src="/a.png" width="40" height="40">
<img id="broken" loading="lazy" src="/missing.png" width="40" height="40">
<img id="hidden" loading="lazy" src="/b.png" width="40" height="40" style="display:none">
</body>`;
let server;
let browser;
let url;

before(async () => {
  server = createServer((req, res) => {
    if (req.url.startsWith('/a.png') || req.url.startsWith('/b.png')) { res.writeHead(200, { 'content-type': 'image/png' }); return res.end(PNG); }
    if (req.url.startsWith('/missing.png')) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(PAGE);
  });
  await new Promise((resolve) => server.listen(0, resolve));
  url = `http://localhost:${server.address().port}/`;
  browser = await chromium.launch({ channel: 'chrome' });
});

after(async () => {
  await browser?.close();
  server?.close();
});

test('sem rolar, a imagem lazy abaixo da dobra nao carregou (o buraco do screenshot)', async () => {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const before = await unloadedImages(page);
  assert.ok(before.some((s) => s.includes('/a.png')), `esperava /a.png pendente, veio ${JSON.stringify(before)}`);
  await page.close();
});

test('depois de primeLazyImages so a imagem quebrada continua na lista; a escondida por CSS nao conta', async () => {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await primeLazyImages(page);
  const left = await unloadedImages(page);
  assert.equal(left.length, 1, JSON.stringify(left));
  assert.match(left[0], /missing\.png/);
  assert.equal(await page.evaluate(() => scrollY), 0, 'a pagina volta ao topo');
  await page.close();
});
