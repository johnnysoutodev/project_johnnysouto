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
          role: $localize`:@@exp.totvs.0.role:Desenvolvedor Front-end`,
          period: $localize`:@@exp.totvs.0.period:Março de 2026 | Atual`,
          bullets: [
            $localize`:@@exp.totvs.0.b1:Desenvolvimento de software front-end com Angular e IA generativa Claude`,
            $localize`:@@exp.totvs.0.b2:Atuação no T-Cloud, plataforma de Cloud da Totvs para simplificar o uso de Cloud pelos clientes`,
            $localize`:@@exp.totvs.0.b3:Integração com APIs e desenvolvimento de componentes reutilizáveis`,
            $localize`:@@exp.totvs.0.b4:Deploy com GitHub Actions`,
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
          role: $localize`:@@exp.santander.0.role:Analista de TI (DevOps)`,
          period: $localize`:@@exp.santander.0.period:Junho de 2024 | Janeiro de 2026`,
          bullets: [
            $localize`:@@exp.santander.0.b1:Suporte à plataforma Gluon, iniciativa global do Santander Group para padronização e modernização das aplicações do banco`,
            $localize`:@@exp.santander.0.b2:Apoio a times na adoção de esteiras CI/CD com GitHub Actions`,
            $localize`:@@exp.santander.0.b3:Integração de ferramentas de qualidade e segurança de código, como SonarQube e Fortify`,
            $localize`:@@exp.santander.0.b4:Gestão e estruturação de repositórios no GitHub, promovendo padronização de código e governança de pipelines`,
          ],
        },
      ],
    },
    {
      company: 'Capgemini',
      logo: { src: '/assets/images/logo_capgemini.png', width: 200, height: 59 },
      positions: [
        {
          role: $localize`:@@exp.capgemini.0.role:Consultor de Sistemas`,
          period: $localize`:@@exp.capgemini.0.period:Julho de 2021 | Janeiro de 2024`,
          bullets: [
            $localize`:@@exp.capgemini.0.b1:Administração de dados SQL, SAP e Salesforce`,
            $localize`:@@exp.capgemini.0.b2:Gestão de dados por fórmulas e gráficos dinâmicos`,
            $localize`:@@exp.capgemini.0.b3:Controle de documentação técnica do projeto Pitcher`,
            $localize`:@@exp.capgemini.0.b4:Treinamento para colaboradores`,
          ],
        },
      ],
    },
    {
      company: 'Vivo',
      logo: { src: '/assets/images/logo_vivo.svg', width: 321, height: 100 },
      positions: [
        {
          role: $localize`:@@exp.vivo.0.role:Analista de Suporte de Sistemas (SOC)`,
          period: $localize`:@@exp.vivo.0.period:Agosto de 2019 | Maio de 2021`,
          bullets: [
            $localize`:@@exp.vivo.0.b1:Administração de acesso a sistemas`,
            $localize`:@@exp.vivo.0.b2:Gestão de acesso aos usuários corporativos`,
            $localize`:@@exp.vivo.0.b3:Configuração de comandos em sistemas de rede Huawei MBB / Ciena OneControl / Padtec`,
          ],
        },
        {
          role: $localize`:@@exp.vivo.1.role:Analista Suporte de Sistemas (OSS)`,
          period: $localize`:@@exp.vivo.1.period:Agosto de 2017 | Agosto de 2019`,
          bullets: [
            $localize`:@@exp.vivo.1.b1:Administração e realização de scripts para Oracle Database`,
            $localize`:@@exp.vivo.1.b2:Monitoração e sustentação de aplicações de desempenho`,
            $localize`:@@exp.vivo.1.b3:CDROne / DBN0 / Altaia / Cricket`,
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
          role: $localize`:@@exp.telefonica-educacao-digital.0.role:Desenvolvedor Front-end`,
          period: $localize`:@@exp.telefonica-educacao-digital.0.period:Agosto de 2015 | Julho de 2017`,
          bullets: [
            $localize`:@@exp.telefonica-educacao-digital.0.b1:Codificação de treinamentos EaD`,
            $localize`:@@exp.telefonica-educacao-digital.0.b2:HTML5 / CSS3 / JavaScript / ActionScript / jQuery / PIXI.js / Node.js`,
            $localize`:@@exp.telefonica-educacao-digital.0.b3:Versionamento de código com GitLab / GitKraken`,
          ],
        },
      ],
    },
    {
      company: 'RCS Sistemas',
      positions: [
        {
          role: $localize`:@@exp.rcs-sistemas.0.role:Desenvolvedor de Sistemas CRM`,
          period: $localize`:@@exp.rcs-sistemas.0.period:Maio de 2015 | Julho de 2015`,
          bullets: [
            $localize`:@@exp.rcs-sistemas.0.b1:Desenvolvimento de aplicações CRM`,
            $localize`:@@exp.rcs-sistemas.0.b2:Linguagens Apex, Visualforce, Triggers e SOQL`,
            $localize`:@@exp.rcs-sistemas.0.b3:Force.com da Salesforce`,
          ],
        },
      ],
    },
    {
      company: 'Nielsen',
      logo: { src: '/assets/images/logo_nielsen.jpg', width: 240, height: 40 },
      positions: [
        {
          role: $localize`:@@exp.nielsen.0.role:Operador de Computador`,
          period: $localize`:@@exp.nielsen.0.period:Janeiro de 2006 | Setembro de 2013`,
          bullets: [
            $localize`:@@exp.nielsen.0.b1:ARCServe Backup / Retal Índex / Scantrack`,
            $localize`:@@exp.nielsen.0.b2:Administração e controle de mídias para backups`,
            $localize`:@@exp.nielsen.0.b3:Processamento em batch e stored procedure de MS-SQL Server`,
          ],
        },
      ],
    },
  ];
}
