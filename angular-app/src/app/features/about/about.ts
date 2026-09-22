import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Tag } from '../../shared/components/tag/tag';
import { calculateExperienceYears } from '../hero/hero';

/**
 * About — design-system.md secao 8.9. Foto sempre a esquerda, bloco de texto (heading +
 * bio + checklist) sempre a direita, sem alternancia de lado (diferente do card do Project,
 * secao 8.5, que alterna). `host: { id: 'about' }` pro anchor `#about` ja referenciado
 * pela navegacao do Header (`layout/header/header.ts`).
 *
 * Checklist "quick bits" (4 itens, 2x2 - secao 8.9): a spec do Figma nao define o
 * conteudo real desses itens (era so texto placeholder de pessoa ficticia, ex. "B.E. in
 * Computer Engineering"). Nenhum dos 4 itens em `about.html` foi inventado - todos sao
 * fatos reais e verificaveis contra `src/pt/index.html` (curriculo legado): anos de
 * experiencia (mesmo calculo do Hero, a partir da primeira experiencia real documentada
 * - Nielsen do Brasil, Jan/2006), formacao ("Superior em Gestao da Tecnologia da
 * Informacao pela Uninove"), idioma ("Ingles intermediario (Leitura / Escrita /
 * Compreensao oral)") e estado civil ("Tenho X anos, casado e um filho" - texto literal
 * do legado). O 4o candidato sugerido no pedido original desta tarefa ("localizacao/
 * stack") NAO foi usado: nao ha cidade/localizacao documentada em nenhum lugar do
 * repositorio (grep confirmado em `src/pt/index.html`), e "stack" so duplicaria o que a
 * secao Skills ja mostra - o estado civil e um fato real disponivel que nao duplica
 * outra secao do site, entao substituiu o candidato sem dado real.
 */
@Component({
  selector: 'app-about',
  imports: [Tag, NgOptimizedImage],
  host: { id: 'about' },
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  /** Mesmo calculo/ano-base do Hero (`features/hero/hero.ts`) - reaproveitado, nao duplicado. */
  protected readonly experienceYears = calculateExperienceYears(new Date().getFullYear());
}
