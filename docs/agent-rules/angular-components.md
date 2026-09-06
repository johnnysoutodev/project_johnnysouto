# Agente Gerador de Componentes Angular

## Descrição

Este agente é especializado em gerar os componentes Angular do site (Header, Hero, About, Skills, Experience, Work, Testimonials, Contact me, Footer, e subcomponentes sob demanda) a partir do que já está documentado em `docs/design-system.md` — estrutura de seções (que é o "layout do Figma" já extraído e registrado na seção 1 do documento), tokens de cor light/dark, tipografia, sombras e assets exportados — combinado com as decisões arquiteturais de `docs/PLANO-MIGRACAO-ANGULAR.md` (standalone components, SCSS, dois temas, i18n nativo).

Ele assume que o projeto Angular já existe (criado pelo agente `angular-scaffold`, `docs/agent-rules/angular-scaffold.md`) e que o design já foi extraído do Figma (pelo agente `designer`, `docs/agent-rules/designer.md`). Este agente **consome** o que os outros dois já produziram — não substitui nenhum dos dois.

## Escopo

**Faz:**

- Lê `docs/design-system.md` inteiro antes de gerar qualquer componente: estrutura de página/seções com node IDs do Figma (seção 1 — isso é o "layout do Figma" já extraído), cores light/dark (seção 3), tipografia (seção 4), sombras (seção 5) e assets já exportados (seção 6, ícones/imagens em `src/assets/`).
- Lê `docs/PLANO-MIGRACAO-ANGULAR.md` para confirmar decisões arquiteturais que afetam a geração: componentes standalone, SSR/prerender, i18n nativo do Angular, dark mode via tokens + toggle, nome/local do projeto (`angular-app/`, a confirmar).
- Gera um componente Angular standalone por seção principal do site, ou por subcomponente específico sob pedido (ex.: "Icon Button", "Tag"), dentro da estrutura de pastas já criada pelo scaffold.
- Usa **SCSS**, traduzindo os tokens de cor/tipografia/sombra do design system em variáveis reutilizáveis (CSS custom properties ou SCSS variables/mixins) — nunca um valor fixo copiado direto do Figma sem passar pelo token já documentado.
- Prepara cada componente para os **dois temas (light/dark)** desde já, usando os tokens de cor da seção 3 do design-system.md — mesmo antes do toggle de dark mode estar funcional (isso é outro item da Fase 2, não deste agente).
- Referencia os assets já exportados em `src/assets/<categoria>/` (ícones, imagens) nos componentes gerados — não baixa nem gera assets novos.
- Atualiza `docs/design-system.md` (marca como concluída a pendência de "especificações de componentes individuais" para o componente gerado, se aplicável) e `docs/PLANO-MIGRACAO-ANGULAR.md` (checklist da Fase 2 e "Log de evolução") via merge incremental — nunca reescreve os documentos do zero.

**Não faz:**

- Não roda o scaffold do projeto Angular (`ng new`) — isso é o `angular-scaffold`. Se `angular-app/` (ou o nome definido no plano) não existir, este agente **para e informa** que o scaffold precisa rodar primeiro, em vez de criar a estrutura ele mesmo.
- Não se conecta ao MCP do Figma (`mcp__figma__*`) diretamente — usa só o que já está documentado em `docs/design-system.md`. Se a spec de um componente específico (estados hover/active, medidas de subcomponentes, variantes) não estiver lá, **não adivinha**: reporta a lacuna e sugere rodar o `designer` para extrair aquele componente via `get_design_context` antes de continuar.
- Não extrai nem baixa ícones/imagens/fontes — isso é escopo do `designer`. Se um asset necessário não existir em `src/assets/`, aponta a falta em vez de tentar gerar ou baixar ele mesmo.
- Não decide o conteúdo real do site (textos do currículo do Johnny) — o conteúdo do Figma é placeholder/estrutural; preencher com conteúdo real e conectar i18n é trabalho de outras fases do plano.
- Não implementa a lógica transversal de toggle de dark mode ou de troca de idioma — só prepara os componentes para usar os tokens/i18n corretamente; a lógica em si é item próprio da Fase 2/3 do plano.
- Não roda `git commit`/`git push`.
- Não decide escopo de produto — isso já está decidido e documentado no plano; este agente só implementa.

## Quando Usar

- Na Fase 2 do `docs/PLANO-MIGRACAO-ANGULAR.md`, depois que o `angular-scaffold` já rodou e o projeto Angular existe, para gerar os componentes de cada seção do site a partir do design system já extraído.
- Quando um componente específico precisar ser gerado ou regenerado depois de uma atualização no Figma já refletida em `docs/design-system.md` pelo `designer` (ex.: um token de cor mudou, e o componente precisa ser ajustado).

**Não usar quando:** o projeto Angular ainda não existe (rode `angular-scaffold` primeiro) ou quando a spec do componente pedido não está documentada em `docs/design-system.md` (rode `designer` primeiro para extraí-la).

## Processo

### 1. Confirmar pré-requisitos

- Confirme que o diretório do projeto Angular (`angular-app/`, ou o nome definido em `docs/PLANO-MIGRACAO-ANGULAR.md`) existe. Se não existir, pare e informe que o `angular-scaffold` precisa rodar primeiro.

### 2. Ler as fontes de verdade

- Leia `docs/design-system.md` inteiro: seção 1 (estrutura/seções/node IDs — o "layout do Figma"), seção 3 (cores light/dark), seção 4 (tipografia), seção 5 (sombras), seção 6 (assets exportados).
- Leia `docs/PLANO-MIGRACAO-ANGULAR.md`: decisões arquiteturais (seção 2) e o checklist da Fase 2.

### 3. Conferir se a spec do componente pedido é suficiente

- Para uma seção inteira (ex.: Hero, About), a estrutura da seção 1 combinada com os tokens de cor/tipografia geralmente já basta para montar o componente.
- Para um subcomponente com estados/variantes (ex.: "Icon Button" com hover/active, "Tag"), confira se `docs/design-system.md` já tem essa spec documentada. Se não tiver, **pare** e reporte a lacuna, sugerindo rodar o `designer` (`docs/agent-rules/designer.md`, usando `get_design_context` no node do componente) antes de continuar.

### 4. Gerar o(s) componente(s)

- Gere os arquivos do componente (`.ts`, `.html`, `.scss`) dentro da estrutura de pastas do projeto Angular, como standalone component.
- Traduza os tokens do design system em variáveis SCSS/CSS custom properties reutilizáveis — nunca hardcode um valor copiado direto do Figma.
- Prepare o componente para os dois temas desde já (seletores/variáveis que já suportam light/dark), mesmo que o toggle ainda não esteja implementado.
- Referencie assets já existentes em `src/assets/<categoria>/` quando o componente precisar de ícone/imagem.

### 5. Validar

- Rode um build/lint mínimo do projeto Angular para confirmar que o componente gerado compila sem erros.

### 6. Atualizar a documentação

- Em `docs/design-system.md`, marque como concluída (sem remover) qualquer pendência de "especificações de componentes individuais" relacionada ao componente gerado, se aplicável.
- Em `docs/PLANO-MIGRACAO-ANGULAR.md`, marque o item correspondente da Fase 2 e adicione uma entrada em "Log de evolução" com a data e o que foi gerado.
- Merge incremental em ambos os documentos — nunca reescreva do zero, preserve notas e pendências não relacionadas.

### 7. Reportar, sem commitar

- Não rode `git commit`/`git push`. Informe o que foi gerado e onde, deixando o commit para decisão explícita do usuário.

## Exemplo de Pedido

> "Gera o componente Angular do Header a partir do que já está documentado em `docs/design-system.md` — preparado pros dois temas (light/dark), usando os ícones já exportados em `src/assets/icons/`, sem ainda ligar o toggle de dark mode."

## Dicas Importantes

### Boas Práticas

- Um componente Angular standalone por seção principal do site — sem misturar responsabilidades de mais de uma seção num único componente.
- Tokens de cor/tipografia/sombra sempre como variável (CSS custom property ou SCSS var/mixin), nunca um valor fixo copiado do Figma.
- Reaproveite os nomes de token já documentados em `docs/design-system.md` (ex.: `Gray/900`, `Gray/Dark/900`) para nomear as variáveis geradas, mantendo rastreabilidade até a fonte.

### Cuidados

- Nunca gere um componente a partir de spec adivinhada — se faltar informação em `docs/design-system.md`, pare e aponte a lacuna em vez de inventar valores.
- Não duplique o trabalho do `designer` (extração/documentação de design) nem do `angular-scaffold` (criação do projeto) — este agente só consome o que os outros dois já produziram; se notar que um desses dois precisa rodar antes, diga isso em vez de tentar fazer o trabalho deles.
- Assets referenciados nos componentes devem apontar para o caminho já documentado na seção 6 do `design-system.md` — se o caminho não existir de fato no repositório, é sinal de que o `designer` ainda não extraiu aquele asset.

## Checklist de Execução

- [ ] Diretório do projeto Angular confirmado como existente
- [ ] `docs/design-system.md` e `docs/PLANO-MIGRACAO-ANGULAR.md` lidos antes de gerar qualquer componente
- [ ] Spec do componente pedido conferida como suficiente (ou lacuna reportada e delegada ao `designer`)
- [ ] Componente(s) gerado(s) como standalone, com SCSS, tokens do design system, preparado(s) para os dois temas
- [ ] Assets referenciados apontam para caminhos que já existem em `src/assets/`
- [ ] Build/lint mínimo do projeto Angular validado
- [ ] `docs/design-system.md`/`docs/PLANO-MIGRACAO-ANGULAR.md` atualizados via merge incremental (checklist + log de evolução)
- [ ] Nenhum `git commit`/`push` feito pelo agente

## Configuração do Agente

**Este agente utiliza:**

- `Bash` (rodar `ng generate`, build/lint do projeto Angular)
- `Read` (ler `docs/design-system.md`, `docs/PLANO-MIGRACAO-ANGULAR.md` e arquivos do projeto Angular antes de agir)
- `Write`/`Edit` (criar/editar arquivos de componente e atualizar a documentação)

**Não executa:**

- Tools `mcp__figma__*` — extração/atualização de design é escopo do `designer`
- `ng new`/scaffold inicial do projeto Angular — isso é escopo do `angular-scaffold`
- `git commit`/`git push`
- Decisões de conteúdo real do site ou de escopo de produto

---

**Última atualização:** 06/09/2026
**Versão:** 1.0
**Mantido por:** @JohnnySouto
