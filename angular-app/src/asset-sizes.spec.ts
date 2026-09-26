import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MAX_BYTES_BY_OUTPUT, OG_COPIES, TARGETS } from '../scripts/image-targets.mjs';
import sharp from 'sharp';

/**
 * Garante que `public/assets/images/` (o que e servido de verdade) esteja em sincronia com
 * `scripts/image-targets.mjs` (a tabela de tamanho-alvo) e `src/assets/images/` (os originais
 * em alta resolucao, nunca servidos). O `npm run build` ja roda `optimize-images.mjs` sozinho
 * (26/09/2026, a pedido do Johnny) antes do `ng build`, entao isso deveria estar sempre em
 * sincronia no deploy real - este teste e a camada de visibilidade LOCAL, no `ng test`, que
 * acusa o problema mais cedo (ex.: alguem editou `image-targets.mjs` mas rodou só `ng build`
 * direto, sem passar pelo script `build` do `package.json`). `ng test` roda a partir da raiz
 * de `angular-app/`.
 */
const ALL_TARGETS = [...TARGETS, ...OG_COPIES];

describe('Imagens estáticas (public/assets/images)', () => {
  it.each(ALL_TARGETS)(
    'output de $output bate com as dimensões do image-targets.mjs',
    async ({ output, width, height }) => {
      const file = resolve(process.cwd(), 'public/assets/images', output);

      expect(existsSync(file), `arquivo ausente: public/assets/images/${output}`).toBe(true);

      const metadata = await sharp(file).metadata();
      expect(metadata.width, `largura de ${output}`).toBe(width);
      expect(metadata.height, `altura de ${output}`).toBe(height);
    },
  );

  it.each(ALL_TARGETS)('$source ainda existe em src/assets/images (original)', ({ source }) => {
    const file = resolve(process.cwd(), 'src/assets/images', source);
    expect(existsSync(file), `original ausente: src/assets/images/${source}`).toBe(true);
  });

  it.each(Object.entries(MAX_BYTES_BY_OUTPUT))(
    '%s não ultrapassa o teto de tamanho de arquivo',
    (output, maxBytes) => {
      const file = resolve(process.cwd(), 'public/assets/images', output);
      const { size } = statSync(file);

      expect(
        size,
        `${output}: ${(size / 1024).toFixed(0)}KB, teto é ${(maxBytes / 1024).toFixed(0)}KB`,
      ).toBeLessThanOrEqual(maxBytes);
    },
  );
});
