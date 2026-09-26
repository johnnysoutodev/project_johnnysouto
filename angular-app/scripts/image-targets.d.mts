// Tipos de `image-targets.mjs` pro TypeScript (`asset-sizes.spec.ts` importa esse .mjs
// diretamente - sem isso, os exports ficam `any`/`unknown`).
export interface ImageTarget {
  readonly source: string;
  readonly output: string;
  readonly width: number;
  readonly height: number;
  readonly format: 'webp' | 'jpeg' | 'png';
  readonly quality?: number;
}

export const TARGETS: readonly ImageTarget[];
export const OG_COPIES: readonly ImageTarget[];
export const MAX_BYTES_BY_OUTPUT: Readonly<Record<string, number>>;
