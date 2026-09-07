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
}

/**
 * Skills — design-system.md secao 8.10. Conteudo real (secao 10): skills reais do
 * curriculo legado (`src/pt/index.html`, secao "Habilidades"), num grid unico "flat" -
 * sem titulo de categoria acima dos itens, igual ao grid do Figma (secao 8.10: 2 linhas
 * x 8 itens, sem agrupamento). A categorizacao por area (Back-End, Banco de Dados,
 * Front-End, Versionamento, Pessoais) do curriculo legado nao aparece mais como titulo
 * visual (revisao de 07/09/2026, a pedido do Johnny - a versao anterior agrupava por
 * categoria com um `<h3>` por grupo, o que o Figma nao tem) - a ordem dos itens abaixo
 * ainda segue essa categorizacao (itens da mesma area ficam agrupados na lista), so sem
 * o header visual.
 *
 * Icones (secao 10, decisao revista em 07/09/2026): 3 itens tinham icone com match
 * direto no Figma (`icon-javascript`, `icon-nodejs`, `icon-git`) - os outros 17 ficavam
 * texto-only por decisao anterior de "nao baixar icone de fora do Figma", o que deixava
 * a secao real bem diferente do grid all-icon do design original. Revertido a pedido do
 * Johnny: 9 icones adicionais baixados do Devicon (MIT, github.com/devicons/devicon) pra
 * fechar o match de skills reais sem equivalente no Figma - Spring, Java, MySQL, Oracle
 * Database, SQL Server, HTML5, CSS3, jQuery, Grunt. LESS (sem icone "so simbolo" no
 * Devicon, so wordmark) foi substituido por Sass/Scss no conteudo real - `icon-sass.svg`
 * ja existia (extraido do Figma, template tambem tinha Sass no grid original). Ficam
 * texto-only, ainda sem icone disponivel em lugar nenhum: Servlet/JSP (nao e uma marca
 * com logo), OOP e RWD (conceitos, nao tecnologias/marcas) e os 4 itens de "Pessoais"
 * (traços de personalidade, fora do escopo de "icone de tecnologia" do Figma).
 */
@Component({
  selector: 'app-skills',
  imports: [Tag, NgOptimizedImage],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly items: readonly SkillItem[] = [
    // Back-End
    { label: 'Spring Framework', icon: '/assets/icons/icon-spring.svg' },
    { label: 'Node.js', icon: '/assets/icons/icon-nodejs.svg', iconWidth: 57 },
    { label: 'Java SE 8', icon: '/assets/icons/icon-java.svg' },
    // Banco de Dados
    { label: 'MySQL', icon: '/assets/icons/icon-mysql.svg' },
    { label: 'Oracle Database', icon: '/assets/icons/icon-oracle.svg' },
    { label: 'SQL Server', icon: '/assets/icons/icon-sqlserver.svg' },
    // Front-End
    { label: 'HTML5', icon: '/assets/icons/icon-html5.svg' },
    { label: 'CSS3', icon: '/assets/icons/icon-css3.svg' },
    { label: 'JavaScript', icon: '/assets/icons/icon-javascript.svg' },
    { label: 'jQuery', icon: '/assets/icons/icon-jquery.svg' },
    { label: 'Sass/Scss', icon: '/assets/icons/icon-sass.svg' },
    { label: 'Grunt', icon: '/assets/icons/icon-grunt.svg' },
    // Versionamento
    { label: 'Git', icon: '/assets/icons/icon-git.svg' },
  ];
}
