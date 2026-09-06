import { Component } from '@angular/core';
import { Tag } from '../../shared/components/tag/tag';
import { IconButton } from '../../shared/components/icon-button/icon-button';

/** Um card de projeto (design-system.md secao 8.5). */
interface WorkProject {
  readonly name: string;
  readonly period: string;
  readonly description: string;
  /** Tags de tecnologia extraidas da descricao real do projeto (secao 10) - nenhuma inventada. */
  readonly tags: readonly string[];
  /**
   * Link real de "saiba mais" do projeto, quando existe no curriculo legado
   * (`src/pt/index.html`). `undefined` quando o projeto nao tem nenhum link publico
   * disponivel - nesse caso a acao do card e omitida (ver comentario em `work.ts` acima
   * da lista `projects` para o raciocinio completo).
   */
  readonly actionHref?: string;
  readonly actionAriaLabel?: string;
}

/**
 * Work — design-system.md secao 8.5 (card). Sem spec propria de raiz de secao documentada
 * (ao contrario de Experience/Skills/About/Contact me, que tem subsecoes 8.9-8.12/8.11) -
 * o heading abaixo (Tag + Subtitle/Normal centralizado) segue o MESMO padrao ja confirmado
 * em TODAS as outras 4 secoes de conteudo com heading centralizado, entao e reaproveitado
 * por consistencia, nao inventado do zero; documentado aqui para rastreabilidade (nao e
 * extracao formal do node `316:415`, e inferencia por padrao repetido no arquivo).
 * `host: { id: 'work' }` para a ancora `#work` ja referenciada pela navegacao do Header.
 *
 * Conteudo real (secao 10): 2 projetos reais (nao 3, como no Figma) - Pitcher e ProFuturo,
 * descricao em texto corrido a partir de `src/pt/index.html` (secao "Projetos"), sem
 * inventar tecnologia nao mencionada no texto. Imagem do card vira bloco neutro (secao 10:
 * projetos corporativos internos, sem material de divulgacao) - sem `<img>` de thumbnail
 * fictício do template.
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
  selector: 'app-work',
  imports: [Tag, IconButton],
  host: { id: 'work' },
  templateUrl: './work.html',
  styleUrl: './work.scss',
})
export class Work {
  protected readonly projects: readonly WorkProject[] = [
    {
      name: 'Pitcher',
      period: 'Julho de 2021 | Projeto em desenvolvimento',
      description:
        'Para otimização do trabalho diário dos promotores, a Coca-Cola FEMSA decidiu ' +
        'por substituir o aplicativo MfCoke pelo Pitcher. Nessa mudança, sou o ' +
        'responsável pelo controle da implantação, os detalhes de integração da base de ' +
        'dados (MS-SQL Server e SAP) e informação dos clientes por Salesforce - controle ' +
        'feito por meio de fórmulas e gráficos dinâmicos, incluindo a instalação e ' +
        'configuração do App Pitcher em todos os dispositivos necessários, dos mais de ' +
        '3000 colaboradores, onde os dados coletados resultam em relatórios gráficos ' +
        'para agilizar a tomada de decisão.',
      tags: ['MS-SQL Server', 'SAP', 'Salesforce'],
      // Sem link publico disponivel no legado (secao 10/comentario acima) - acao omitida.
    },
    {
      name: 'ProFuturo',
      period: 'Agosto de 2015 | Dezembro de 2016',
      description:
        'Neste projeto iniciamos o desenvolvimento com HTML5, CSS3, JavaScript e ' +
        'jQuery, mas no decorrer notamos que a performance estava sendo prejudicada. ' +
        'Decidimos então migrar todo o projeto para JavaScript e, juntamente com a ' +
        'framework PIXI.js, uma API foi desenvolvida com todas as funcionalidades ' +
        'necessárias, além de estruturar templates para acelerar o processo de produção ' +
        'e automatizar algumas tarefas utilizando Grunt. Por fim, controlamos as ' +
        'versões com o GitLab.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PIXI.js', 'Grunt', 'GitLab'],
      actionHref: 'https://fundacaotelefonicavivo.org.br/profuturo/',
      actionAriaLabel: 'Leia mais sobre o projeto ProFuturo (abre em nova aba)',
    },
  ];
}
