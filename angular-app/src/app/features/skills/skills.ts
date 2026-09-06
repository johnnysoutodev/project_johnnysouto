import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Tag } from '../../shared/components/tag/tag';

/** Um item do grid "Tech" (design-system.md secao 8.10) - icone opcional (secao 10). */
interface SkillItem {
  readonly label: string;
  /** Caminho em `public/assets/icons/` - so preenchido pros 3 itens com match real (secao 10). */
  readonly icon?: string;
  /** Largura real do SVG em px (a caixa do icone tem altura fixa de 64px, mas largura
   * varia conforme a proporcao do icone - secao 8.10). Default 64 (quadrado) quando nao informado. */
  readonly iconWidth?: number;
}

interface SkillGroup {
  readonly category: string;
  readonly items: readonly SkillItem[];
}

/**
 * Skills — design-system.md secao 8.10. Conteudo real (secao 10): skills reais
 * agrupados por categoria (Back-End, Banco de Dados, Front-End, Versionamento,
 * Pessoais), replicando a mesma categorizacao/lista ja usada no curriculo legado
 * (`src/pt/index.html`, secao "Habilidades") - nenhum item abaixo foi inventado. So 3
 * itens tem icone com match real no Figma: `icon-javascript`, `icon-nodejs`, `icon-git`
 * (secao 10, decisao ja fechada) - os demais sao texto-only.
 *
 * Estrutura por categoria: o grid do Figma (secao 8.10) e um flat "2 linhas x 8 itens"
 * sem categorias - mas o conteudo real ja vem categorizado no curriculo legado, e essa
 * categorizacao e informacao real que nao deveria se perder na migracao. Agrupar por
 * categoria (com um titulo de categoria acima de cada linha) e uma adaptacao de UI por
 * convencao, nao uma extracao do Figma - ver comentario detalhado em `skills.scss`.
 * Cada categoria vira uma linha `flex-wrap` de itens `Tech` (nao um `justify-between`
 * fixo de 8 itens): a contagem real varia por categoria (5/3/7/1/4), e um
 * `justify-between` deixaria a categoria "Versionamento" (1 item so) esticada de forma
 * estranha pela largura toda.
 */
@Component({
  selector: 'app-skills',
  imports: [Tag, NgOptimizedImage],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly groups: readonly SkillGroup[] = [
    {
      category: 'Back-End',
      items: [
        { label: 'Spring Framework / Spring Boot' },
        { label: 'Node.js', icon: '/assets/icons/icon-nodejs.svg', iconWidth: 57 },
        { label: 'Java SE 8' },
        { label: 'Servlet / JSP' },
        { label: 'Programação Orientada a Objetos (OOP)' },
      ],
    },
    {
      category: 'Banco de Dados',
      items: [
        { label: 'MySQL' },
        { label: 'Oracle Database' },
        { label: 'Microsoft SQL Server' },
      ],
    },
    {
      category: 'Front-End',
      items: [
        { label: 'HTML5' },
        { label: 'CSS3' },
        { label: 'RWD' },
        { label: 'JavaScript', icon: '/assets/icons/icon-javascript.svg' },
        { label: 'jQuery' },
        { label: 'LESS' },
        { label: 'Grunt' },
      ],
    },
    {
      category: 'Versionamento',
      items: [{ label: 'Git', icon: '/assets/icons/icon-git.svg' }],
    },
    {
      category: 'Pessoais',
      items: [
        { label: 'Bom relacionamento interpessoal' },
        { label: 'Trabalho em equipe' },
        { label: 'Comprometido' },
        { label: 'Analítico' },
      ],
    },
  ];
}
