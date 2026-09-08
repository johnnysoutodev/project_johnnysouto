import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Tag } from '../../shared/components/tag/tag';

/** Um item do grid "Tech" (design-system.md secao 8.10) - icone opcional (secao 10). */
interface SkillItem {
  readonly label: string;
  /** Caminho em `public/assets/icons/` - preenchido pros itens com icone (secao 10). */
  readonly icon?: string;
  /** Largura real do SVG em px (a caixa do icone tem altura fixa de 64px, mas largura
   * varia conforme a proporcao do icone - secao 8.10). Default 64 (quadrado) quando nao informado. */
  readonly iconWidth?: number;
  /** `true` pros icones de marca monocromaticos quase pretos (ex. `icon-github.svg`,
   * `#181616` no Devicon) - sem isso, ficam ilegiveis no dark mode (preto quase-puro
   * sobre o fundo escuro do tema, falha WCAG AA de contraste). Aplica um filtro CSS de
   * inversao de cor só quando `[data-theme='dark']` (ver `skills.scss`), preto vira
   * quase-branco só no tema escuro - nao afeta o tema claro, onde o preto original ja
   * tem contraste correto contra o fundo branco. */
  readonly invertOnDark?: boolean;
}

/**
 * Skills — design-system.md secao 8.10. Grid unico "flat" - sem titulo de categoria
 * acima dos itens, igual ao grid do Figma (secao 8.10: 2 linhas x 8 itens, sem
 * agrupamento).
 *
 * Ordem dos itens (revisao de 07/09/2026, a pedido do Johnny): embaralhada de proposito,
 * intercalando categorias (Back-End, Banco de Dados, Front-End, Versionamento, Cloud,
 * Ferramentas) uma a uma - nao agrupada por area como antes, pra o grid nao ficar com
 * "blocos" visuais de icones parecidos (ex. 4 databases seguidos). A categoria de cada
 * item continua marcada como comentario inline, so como referencia - nao afeta o
 * render, so documentacao. Ordem fixa (nao gerada em runtime): o site e SSR/prerender,
 * gerar a ordem com `Math.random()` no componente arriscaria um mismatch de hydration
 * (servidor renderiza uma ordem, o browser calcula outra na primeira execucao).
 *
 * Icones (secao 10 do design-system.md tem o historico completo da decisao): a lista
 * inicial replicava 1:1 o curriculo legado (`src/pt/index.html`), com varios itens sem
 * match de icone no Figma (Servlet/JSP, OOP, RWD, soft skills) - texto-only. Revisao de
 * 07/09/2026 (a pedido do Johnny, editando o componente diretamente) trocou a lista pra
 * um conjunto atualizado de skills reais, todas com icone: 3 vieram do Figma
 * (`icon-javascript`, `icon-nodejs`, `icon-git`), `icon-sass` tambem ja existia no Figma
 * (template original tinha Sass no grid), e o restante veio do Devicon (MIT,
 * github.com/devicons/devicon) - Spring, Java, TypeScript, MySQL, PostgreSQL, MongoDB,
 * DynamoDB, HTML5, CSS3, AngularJS, Grunt, GitHub, Azure, VS Code. AWS usa a variante
 * `plain-wordmark` do Devicon (o unico ícone existente pra marca - nao ha um "so
 * simbolo" isolado). `icon-github.svg` (`#181616`, quase preto) usa `invertOnDark` pra
 * nao ficar ilegivel no dark mode (ver o proprio campo na interface `SkillItem`).
 */
@Component({
  selector: 'app-skills',
  imports: [Tag, NgOptimizedImage],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly items: readonly SkillItem[] = [
    { label: 'Spring', icon: '/assets/icons/icon-spring.svg' }, // Back-End
    { label: 'MySQL', icon: '/assets/icons/icon-mysql.svg' }, // Banco de Dados
    { label: 'HTML5', icon: '/assets/icons/icon-html5.svg' }, // Front-End
    { label: 'Git', icon: '/assets/icons/icon-git.svg' }, // Versionamento
    { label: 'AWS', icon: '/assets/icons/icon-aws.svg' }, // Cloud
    { label: 'VS Code', icon: '/assets/icons/icon-vscode.svg' }, // Ferramentas
    { label: 'CSS3', icon: '/assets/icons/icon-css3.svg' }, // Front-End
    { label: 'Node.js', icon: '/assets/icons/icon-nodejs.svg', iconWidth: 57 }, // Back-End
    { label: 'PostgreSQL', icon: '/assets/icons/icon-postgresql.svg' }, // Banco de Dados
    { label: 'Angular', icon: '/assets/icons/icon-angularjs.svg' }, // Front-End
    { label: 'GitHub', icon: '/assets/icons/icon-github.svg', invertOnDark: true }, // Versionamento
    { label: 'Azure', icon: '/assets/icons/icon-azure.svg' }, // Cloud
    { label: 'JavaScript', icon: '/assets/icons/icon-javascript.svg' }, // Front-End
    { label: 'Java', icon: '/assets/icons/icon-java.svg' }, // Back-End
    { label: 'MongoDB', icon: '/assets/icons/icon-mongodb.svg', iconWidth: 30 }, // Banco de Dados
    { label: 'Sass/Scss', icon: '/assets/icons/icon-sass.svg' }, // Front-End
    { label: 'TypeScript', icon: '/assets/icons/icon-typescript.svg' }, // Back-End
    { label: 'DynamoDB', icon: '/assets/icons/icon-dynamodb.svg' }, // Banco de Dados
    { label: 'Grunt', icon: '/assets/icons/icon-grunt.svg' }, // Front-End
  ];
}
