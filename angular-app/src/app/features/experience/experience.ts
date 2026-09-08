import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Tag } from '../../shared/components/tag/tag';

/**
 * Logo da empresa (design-system.md secao 8.6: slot de 102x28). `width`/`height` sao o
 * aspect ratio real do arquivo fonte (nao o tamanho final renderizado, controlado via CSS
 * em `.experience__logo`) - exigido pelo `NgOptimizedImage` pra evitar layout shift.
 */
interface ExperienceLogo {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /**
   * Override opcional da altura de exibicao (px), pro caso de um logo especifico
   * precisar ficar menor/maior que o padrao de `.experience__logo` (ex. Santander, cujo
   * arquivo fonte tem bastante espaco vazio ao redor da marca, ficando visualmente
   * maior que os outros logos na mesma altura padrao).
   */
  readonly displayHeight?: number;
  /**
   * Override opcional da largura maxima de exibicao (px) - so precisa ser setado junto
   * com `displayHeight` quando o valor aumentado de altura faria a largura estourar o
   * `max-width` padrao de `.experience__logo` (96px mobile / 120px desktop), cortando o
   * logo. Ver Totvs (08/09/2026, a pedido do Johnny: logo pequeno demais no padrao).
   */
  readonly displayWidth?: number;
}

/** Um cargo dentro de uma empresa (cargo + periodo + atividades daquele cargo especifico). */
interface ExperiencePosition {
  readonly role: string;
  readonly period: string;
  readonly bullets: readonly string[];
}

/**
 * Um item da timeline (design-system.md secao 8.6): 1 empresa (com logo opcional) + 1 ou
 * mais cargos exercidos nela. `logo` ausente (RCS, sem logo disponivel) mantem o nome da
 * empresa como texto.
 */
interface ExperienceItem {
  readonly company: string;
  readonly logo?: ExperienceLogo;
  readonly positions: readonly ExperiencePosition[];
}

/**
 * Experience — design-system.md secoes 8.6 (item) e 8.11 (raiz da secao). Heading e
 * Tag + `Subtitle/Normal` (nao H2, ver 8.11); o mesmo `gap: 48px` do Container rege tanto
 * heading->primeiro item quanto item->item (confirmado por geometria via `get_metadata`
 * na extracao original). Sem conector visual de timeline (linha/marcador) - confirmado
 * ausente em 8.6/8.11 via `get_screenshot`: os itens sao simplesmente empilhados.
 *
 * Conteudo real: os 7 itens abaixo cobrem TODA a experiencia profissional real documentada
 * em `src/pt/index.html` ("Experiencia Profissional") - nenhum cargo/periodo/atividade foi
 * inventado; bullets sao o texto real de cada `<li>` do legado, so removendo marcacao de
 * link/abbr (mantendo o texto visivel).
 *
 * Vivo tem 2 cargos (SOC e OSS) dentro do MESMO item de timeline (1 logo, 2 blocos de
 * cargo/periodo/atividades empilhados em `experience__positions`) - decisao a pedido do
 * Johnny (08/09/2026): antes eram 2 `ExperienceItem`/2 cards separados (cada um com seu
 * proprio logo duplicado); agora e 1 card por empresa, com `positions` cobrindo os casos
 * de mais de um cargo na mesma empresa. `ExperienceItem`/`ExperiencePosition` foram
 * desenhados para esse caso geral, nao so pra Vivo especificamente.
 *
 * Logos: fornecidos pelo Johnny em `public/assets/images/` pra todas as empresas exceto
 * RCS (sem logo disponivel - mantida como texto, ver `ExperienceItem.logo` opcional acima).
 */
@Component({
  selector: 'app-experience',
  imports: [Tag, NgOptimizedImage],
  host: { id: 'experience' },
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  protected readonly items: readonly ExperienceItem[] = [
    {
      company: 'Totvs',
      logo: {
        src: '/assets/images/logo_totvs.jpg',
        width: 200,
        height: 112,
        displayHeight: 56,
        displayWidth: 100,
      },
      positions: [
        {
          role: 'Desenvolvedor Front-end',
          period: 'Março de 2026 | Atual',
          bullets: [
            'Desenvolvimento de software front-end com Angular e IA generativa Claude',
            'Integração com APIs e desenvolvimento de componentes reutilizáveis',
            'Deploy com GitHub Actions',
            'Atuação no T-Cloud, plataforma de Cloud da Totvs para simplificar o uso de Cloud pelos clientes',
            'Busca constante por melhorias na experiência do usuário e na eficiência do desenvolvimento',
          ],
        },
      ],
    },
    {
      company: 'Santander',
      logo: {
        src: '/assets/images/logo_santander.png',
        width: 229,
        height: 40,
        displayHeight: 20,
      },
      positions: [
        {
          role: 'Analista de Suporte de Sistemas (DevOps)',
          period: 'Junho de 2024 | Janeiro de 2026',
          bullets: [
            'Suporte à plataforma Gluon, iniciativa global do Santander Group para padronização e modernização das aplicações do banco',
            'Garantia de boas práticas de desenvolvimento e segurança',
            'Apoio a times na adoção de esteiras CI/CD com GitHub Actions',
            'Integração de ferramentas de qualidade e segurança de código, como SonarQube e Fortify',
            'Gestão e estruturação de repositórios no GitHub, promovendo padronização de código e governança de pipelines',
          ],
        },
      ],
    },
    {
      company: 'Capgemini',
      logo: { src: '/assets/images/logo_capgemini.png', width: 200, height: 59 },
      positions: [
        {
          role: 'Consultor de Sistemas',
          period: 'Julho de 2021 | Janeiro de 2024',
          bullets: [
            'Administração de dados SQL, SAP e Salesforce',
            'Gestão de dados por fórmulas e gráficos dinâmicos',
            'Controle de documentação técnica do projeto Pitcher',
            'Treinamento para colaboradores',
          ],
        },
      ],
    },
    {
      company: 'Vivo',
      logo: { src: '/assets/images/logo_vivo.svg', width: 321, height: 100 },
      positions: [
        {
          role: 'Analista de Suporte de Sistemas (SOC)',
          period: 'Agosto de 2019 | Maio de 2021',
          bullets: [
            'Configuração de comandos em sistemas de rede Huawei MBB / Ciena OneControl / Padtec',
            'Administração de acesso a sistemas',
            'Gestão de acesso aos usuários corporativos',
          ],
        },
        {
          role: 'Analista Suporte de Sistemas (OSS)',
          period: 'Agosto de 2017 | Agosto de 2019',
          bullets: [
            'Administração e realização de scripts para Oracle Database',
            'Monitoração e sustentação de aplicações de desempenho',
            'CDROne / DBN0 / Altaia / Cricket',
          ],
        },
      ],
    },
    {
      company: 'Telefônica Educação Digital',
      logo: {
        src: '/assets/images/logo_telefonica_educacion_digital.png',
        width: 187,
        height: 56,
      },
      positions: [
        {
          role: 'Desenvolvedor Front-end',
          period: 'Agosto de 2015 | Julho de 2017',
          bullets: [
            'HTML5 / CSS3 / JavaScript / ActionScript / jQuery / PIXI.js / Node.js',
            'Codificação de treinamentos EaD',
            'GitLab / GitKraken',
          ],
        },
      ],
    },
    {
      company: 'RCS Sistemas',
      positions: [
        {
          role: 'Desenvolvedor de Sistemas CRM',
          period: 'Maio de 2015 | Julho de 2015',
          bullets: [
            'Force.com da Salesforce',
            'Linguagens Apex, Visualforce, Triggers e SOQL',
            'Desenvolvimento de aplicações CRM',
          ],
        },
      ],
    },
    {
      company: 'Nielsen',
      logo: { src: '/assets/images/logo_nielsen.png', width: 240, height: 40 },
      positions: [
        {
          role: 'Operador de Computador',
          period: 'Janeiro de 2006 | Setembro de 2013',
          bullets: [
            'Processamento em batch e stored procedure de MS-SQL Server',
            'Administração e controle de mídias para backups',
            'ARCServe Backup / Retal Índex / Scantrack',
          ],
        },
      ],
    },
  ];
}
