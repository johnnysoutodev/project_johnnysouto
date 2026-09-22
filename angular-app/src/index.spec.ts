import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

/**
 * Testa o `<script>` do Google Analytics embutido em `index.html` (22/09/2026, a pedido
 * do Johnny - movido pra cá, fora do Angular/zone.js, ver o comentário no próprio
 * `index.html`). Como esse script roda ANTES do Angular (nao e um componente), nao da
 * pra testar via `TestBed` - extrai o texto do script do HTML de verdade e roda numa
 * sandbox (`vm`), com `window`/`document`/`location` minimos, do mesmo jeito que um
 * navegador real executaria. `ng test` roda a partir da raiz de `angular-app/`.
 */
function extractAnalyticsScript(): string {
  const html = readFileSync(resolve(process.cwd(), 'src/index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const analyticsScript = scripts.find((s) => s.includes('ga-disable'));
  if (!analyticsScript) {
    throw new Error('script do Google Analytics não encontrado em src/index.html');
  }
  return analyticsScript;
}

function run(hostname: string) {
  const appendedScripts: Record<string, unknown>[] = [];
  const window: Record<string, unknown> = {};
  const document = {
    createElement: (tag: string) => {
      if (tag !== 'script') {
        throw new Error(`elemento inesperado: ${tag}`);
      }
      return {} as Record<string, unknown>;
    },
    head: {
      appendChild: (el: Record<string, unknown>) => appendedScripts.push(el),
    },
  };
  window['window'] = window;
  window['document'] = document;
  window['location'] = { hostname };

  runInNewContext(extractAnalyticsScript(), window);

  return { window, appendedScripts };
}

describe('index.html — script do Google Analytics', () => {
  it.each(['project-johnnysouto-abc123.vercel.app', 'localhost'])(
    'não faz nada em hosts que não são de produção (%s)',
    (hostname) => {
      const { window, appendedScripts } = run(hostname);

      expect(window['dataLayer']).toBeUndefined();
      expect(window['gtag']).toBeUndefined();
      expect(appendedScripts).toHaveLength(0);
    },
  );

  it.each(['www.johnnysouto.com.br', 'johnnysouto.com.br'])(
    'configura o GA4 e injeta o loader nos hosts de produção (%s)',
    (hostname) => {
      const { window, appendedScripts } = run(hostname);

      expect(window['ga-disable-G-YYR4SND80L']).toBe(false);
      expect(typeof window['gtag']).toBe('function');
      // `dataLayer.push(arguments)` empilha objetos `arguments` (array-like, igual ao
      // snippet oficial do gtag.js) - converte pra array de verdade antes de comparar.
      const dataLayer = (window['dataLayer'] as ArrayLike<unknown>[]).map((args) =>
        Array.from(args),
      );
      const [jsEntry] = dataLayer;
      // `new Date()` roda dentro da sandbox (`vm`), numa realm diferente da deste arquivo
      // de teste - `instanceof Date`/`expect.any(Date)` não reconhecem entre realms, daí
      // o check por duck typing (`Object.prototype.toString`, que funciona cross-realm).
      expect(jsEntry[0]).toBe('js');
      expect(Object.prototype.toString.call(jsEntry[1])).toBe('[object Date]');
      expect(dataLayer).toContainEqual([
        'config',
        'G-YYR4SND80L',
        {
          cookie_domain: 'johnnysouto.com.br',
          cookie_expires: 60 * 60 * 24 * 90,
          cookie_update: false,
        },
      ]);
      expect(appendedScripts).toHaveLength(1);
      expect(appendedScripts[0]['async']).toBe(true);
      expect(appendedScripts[0]['src']).toBe(
        'https://www.googletagmanager.com/gtag/js?id=G-YYR4SND80L',
      );
    },
  );
});
