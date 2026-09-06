import { Component } from '@angular/core';
import { Tag } from '../../shared/components/tag/tag';

/** Um item da timeline (design-system.md secao 8.6) - empresa vira texto, nao logo (secao 10). */
interface ExperienceItem {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly bullets: readonly string[];
}

/**
 * Experience — design-system.md secoes 8.6 (item) e 8.11 (raiz da secao). Heading e
 * Tag + `Subtitle/Normal` (nao H2, ver 8.11); o mesmo `gap: 48px` do Container rege tanto
 * heading->primeiro item quanto item->item (confirmado por geometria via `get_metadata`
 * na extracao original). Sem conector visual de timeline (linha/marcador) - confirmado
 * ausente em 8.6/8.11 via `get_screenshot`: os itens sao simplesmente empilhados.
 *
 * Conteudo real (secao 10: "logos de empresa" -> texto, nao extracao do Figma; sem logo
 * disponivel/apropriado pras empresas reais do Johnny). As 6 entradas abaixo cobrem TODA
 * a experiencia profissional real documentada em `src/pt/index.html` ("Experiencia
 * Profissional") - nenhum cargo/periodo/atividade foi inventado; bullets sao o texto real
 * de cada `<li>` do legado, so removendo marcacao de link/abbr (mantendo o texto visivel).
 * Telefonica Brasil aparece 2x (SOC e OSS) porque sao 2 cargos distintos, com periodos e
 * atividades proprios, dentro do mesmo bloco `hist-content` do legado - tratados aqui como
 * 2 itens de timeline separados, nao 1 so.
 */
@Component({
  selector: 'app-experience',
  imports: [Tag],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  protected readonly items: readonly ExperienceItem[] = [
    {
      company: 'Coca-Cola FEMSA (via Capgemini)',
      role: 'Consultor',
      period: 'Julho de 2021 | Atual',
      bullets: [
        'Administração de dados SQL, SAP e Salesforce',
        'Gestão de dados por fórmulas e gráficos dinâmicos',
        'Controle de documentação técnica do projeto Pitcher',
        'Treinamento para colaboradores',
      ],
    },
    {
      company: 'Telefônica Brasil',
      role: 'Analista Suporte de Sistemas (SOC)',
      period: 'Agosto de 2019 | Maio de 2021',
      bullets: [
        'Configuração de comandos em sistemas de rede Huawei MBB / Ciena OneControl / Padtec',
        'Administração de acesso a sistemas',
        'Gestão de acesso aos usuários corporativos',
      ],
    },
    {
      company: 'Telefônica Brasil',
      role: 'Analista Suporte de Sistemas (OSS)',
      period: 'Agosto de 2017 | Agosto de 2019',
      bullets: [
        'Administração e realização de scripts para Oracle Database',
        'Monitoração e sustentação de aplicações de desempenho',
        'CDROne / DBN0 / Altaia / Cricket',
      ],
    },
    {
      company: 'Telefônica Educação Digital',
      role: 'Programador',
      period: 'Agosto de 2015 | Julho de 2017',
      bullets: [
        'HTML5 / CSS3 / JavaScript / ActionScript / jQuery / PIXI.js / Node.js',
        'Codificação de treinamentos EaD',
        'GitLab / GitKraken',
      ],
    },
    {
      company: 'RCS Sistemas',
      role: 'Desenvolvedor de Sistemas Trainee',
      period: 'Maio de 2015 | Julho de 2015',
      bullets: [
        'Force.com da Salesforce',
        'Linguagens Apex, Visualforce, Triggers e SOQL',
        'Desenvolvimento de aplicações CRM',
      ],
    },
    {
      company: 'Nielsen do Brasil',
      role: 'Operador de Computador',
      period: 'Janeiro de 2006 | Setembro de 2013',
      bullets: [
        'Processamento em batch e stored procedure de MS-SQL Server',
        'Administração e controle de mídias para backups',
        'ARCServe Backup / Retal Índex / Scantrack',
      ],
    },
  ];
}
