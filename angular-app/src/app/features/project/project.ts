import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Tag } from '../../shared/components/tag/tag';
import { IconButton } from '../../shared/components/icon-button/icon-button';

/** Logo do projeto (largura/altura = aspect ratio real do arquivo, exigido pelo `NgOptimizedImage`). */
interface ProjectLogo {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /**
   * Override opcional da altura maxima de exibicao (px), pro caso de um logo especifico
   * precisar ficar menor que o padrao de `.project__image img` (160px) - os logos tem
   * proporcoes bem diferentes entre si (Pitcher mais "cheio" dentro da propria caixa,
   * ProFuturo com bastante espaco vazio ao redor da assinatura), entao a mesma altura
   * maxima os deixa em tamanhos visuais desiguais.
   */
  readonly displayMaxHeight?: number;
}

/** Um card de projeto (design-system.md secao 8.5). */
interface ProjectItem {
  readonly name: string;
  readonly period: string;
  readonly description: string;
  /** Tags de tecnologia extraidas da descricao real do projeto (secao 10) - nenhuma inventada. */
  readonly tags: readonly string[];
  /**
   * Link real de "saiba mais" do projeto, quando existe no curriculo legado
   * (`src/pt/index.html`). `undefined` quando o projeto nao tem nenhum link publico
   * disponivel - nesse caso a acao do card e omitida (ver comentario em `project.ts`
   * acima da lista `projects` para o raciocinio completo).
   */
  readonly actionHref?: string;
  readonly actionAriaLabel?: string;
  /**
   * Logo do projeto (fornecido pelo Johnny em `public/assets/images/`, nomeado
   * `logo_project_<nome>`), exibido no lado da imagem do card no lugar do bloco neutro
   * original. Opcional pra cobrir o caso de um projeto futuro sem logo disponivel.
   */
  readonly logo?: ProjectLogo;
  /**
   * Override opcional do fundo do bloco de imagem, com uma cor FIXA (nao um token que
   * inverte no dark mode) - necessario pro logo do Pitcher, que tem as letras pretas: no
   * fundo padrao (`--color-gray-50`, que vira quase-preto no dark mode) o logo preto some.
   * ProFuturo nao precisa (logo azul, contraste ja suficiente nos dois temas).
   */
  readonly imageBackground?: string;
}

/**
 * Project (renomeado de "Work" em 08/09/2026, a pedido do Johnny - conteudo real da
 * secao sempre foram projetos, "Work" era so o nome do frame no Figma) — design-system.md
 * secao 8.5 (card). Sem spec propria de raiz de secao documentada (ao contrario de
 * Experience/Skills/About/Contact me, que tem subsecoes 8.9-8.12/8.11) - o heading abaixo
 * (Tag + Subtitle/Normal centralizado) segue o MESMO padrao ja confirmado em TODAS as
 * outras 4 secoes de conteudo com heading centralizado, entao e reaproveitado por
 * consistencia, nao inventado do zero; documentado aqui para rastreabilidade (nao e
 * extracao formal do node `316:415` do Figma, que continua se chamando "Work" na
 * ferramenta de design - a renomeacao e so do componente Angular).
 * `host: { id: 'project' }` para a ancora `#project` ja referenciada pela navegacao do
 * Header (antes `#work`, atualizado junto com o rename).
 *
 * Conteudo real (secao 10): 2 projetos reais (nao 3, como no Figma) - Pitcher e ProFuturo,
 * descricao em texto corrido a partir de `src/pt/index.html` (secao "Projetos"), sem
 * inventar tecnologia nao mencionada no texto. Imagem do card: logo do projeto (fornecido
 * pelo Johnny, 08/09/2026) centralizado sobre o bloco neutro que antes ficava vazio -
 * projetos corporativos internos sem thumbnail/screenshot real disponivel, mas com o logo
 * proprio de cada um, que e um dado real (nao um `<img>` de placeholder ficticio do
 * template original).
 *
 * Decisao sobre a acao do card (Icon Button "ver projeto", spec 8.5): projetos
 * corporativos internos, sem link publico. Em vez de omitir a acao nos 2 cards OU
 * apontar os 2 para um link generico (GitHub/LinkedIn do Johnny, que nao tem relacao
 * direta com "ver este projeto") - resolvido caso a caso com o dado real disponivel:
 * Pitcher nao tem nenhum link no legado -> acao OMITIDA (nao inventada). ProFuturo TEM
 * um link real ja existente no legado (`<a class="readmore" href="https://fundacaotelefonicavivo.org.br/profuturo/">Leia
 * mais ...</a>`, pagina da Fundacao Telefonica Vivo sobre o projeto) -> reaproveitado como
 * a acao do card. Essa e a leitura mais fiel ao conteudo real: quando existe destino
 * verdadeiro, ele e usado; quando nao existe, a acao nao aparece (sem afirmar visualmente
 * "ver projeto" pra um link que nao existe).
 */
@Component({
  selector: 'app-project',
  imports: [Tag, IconButton, NgOptimizedImage],
  host: { id: 'project' },
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  protected readonly projects: readonly ProjectItem[] = [
    {
      name: 'Pitcher App',
      period: $localize`:@@project.pitcher.period:Julho de 2021 | Outubro de 2023`,
      description: $localize`:@@project.pitcher.description:A Coca-Cola FEMSA substituiu o aplicativo MfCoke pelo Pitcher App para agilizar o trabalho diário dos promotores. Fui responsável pela implantação: integração das bases de dados (MS-SQL Server e SAP), pela gestão das informações de clientes no Salesforce com fórmulas e gráficos dinâmicos, e instalação e configuração do app nos dispositivos de mais de 3.000 colaboradores. Os dados coletados geram relatórios gráficos que aceleram a tomada de decisão.`,
      tags: ['Salesforce', 'Azure', 'MS-SQL Server', 'SAP', 'Google Sheets'],
      // Sem link publico disponivel no legado (secao 10/comentario acima) - acao omitida.
      logo: { src: '/assets/images/logo_project_coca-cola_femsa.png', width: 280, height: 100 },
      imageBackground: '#f9fafb',
    },
    {
      name: 'ProFuturo',
      period: $localize`:@@project.profuturo.period:Agosto de 2015 | Dezembro de 2016`,
      description: $localize`:@@project.profuturo.description:Sistema de ensino pré-escolar e fundamental por tablet, para crianças de todo o mundo, com telas interativas e disponível em vários idiomas. Desenvolvi o front-end com HTML5, CSS3 e JavaScript e, para ganhar performance, migramos de jQuery para JavaScript puro com PIXI.js. Criamos uma API com as funcionalidades do projeto e templates que aceleraram a produção, automatizamos tarefas com Grunt e versionamos o código no GitLab.`,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PIXI.js', 'Grunt', 'GitLab'],
      actionHref: 'https://fundacaotelefonicavivo.org.br/profuturo/',
      actionAriaLabel: $localize`:@@project.profuturo.action.aria:Leia mais sobre o projeto ProFuturo (abre em nova aba)`,
      logo: {
        src: '/assets/images/logo_project_profuturo.png',
        width: 480,
        height: 152,
        displayMaxHeight: 96,
      },
    },
  ];

  /** Texto alternativo do logo do projeto (traduzido via `$localize`). */
  protected logoAlt(name: string): string {
    return $localize`:@@project.logo.alt:Logo do projeto ${name}:name:`;
  }
}
