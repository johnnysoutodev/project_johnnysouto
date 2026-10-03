# Brief — Johnny Souto

> Cliente nº 1 do site-factory: o site pessoal já existe (migração do legado para Angular). Este brief documenta o que já foi decidido, para servir de caso de teste do pipeline. O conteúdo textual real vive nos arquivos de dados dos componentes (ver `contentRef` no `site-spec.json`).

## Cliente
- Nome: Johnny Souto
- E-mail de contato: johnnyjns@gmail.com
- Domínio: https://www.johnnysouto.com.br

## Objetivo
Apresentar o currículo e a experiência profissional de engenheiro de software e levar o visitante a entrar em contato (e-mail, LinkedIn, WhatsApp).

## Público
Recrutadores, gestores de engenharia e potenciais clientes que avaliam experiência, stack e projetos.

## Tom e personalidade
Profissional, direto, técnico e acessível.

## Design
- Link do Figma: <https://www.figma.com/design/9z2dzCKhlXWqVynN5SEeEM/template_portfolio_website?node-id=0-1&m=dev&t=p400RgMm8j8SjqJM-1>
- O Figma é referência de layout e estilo (template genérico com placeholders; conteúdo real substitui os textos).
- Temas: claro e escuro.

## Seções e conteúdo
Header (menu, com menu mobile), Hero, Sobre, Skills (grid de ícones), Experiência (timeline com logos), Projetos (2 cards), Depoimentos (2 reais), Contato, Footer. Decisões detalhadas de conteúdo real vs. Figma: `docs/design-system.md`, seção 10.

## Idiomas
- Principal: pt-BR
- Outros: en-US, es-ES (i18n nativo do Angular)

## Publicação (deploy)
Vercel, build estático (prerender por idioma). Ambientes: Develop (branch `develop`, preview) e Production (branch `main`, https://www.johnnysouto.com.br).

## SEO e métricas
- Título: "Johnny Souto | Engenheiro de Software"
- Google Analytics 4 com banner de consentimento.

## Restrições
LGPD (consentimento antes do GA4). Fotos e logos fornecidos pelo próprio Johnny; sem marcas de terceiros sem fonte oficial.
