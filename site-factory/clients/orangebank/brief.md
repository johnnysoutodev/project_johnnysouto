# Brief: Orange Bank (prova do template, fase 7b)

> Cliente de prova do template. Textos reais vêm do Figma; não inventar nada além deles.

## Cliente
- Nome: Orange Bank
- E-mail de contato: não informado
- Domínio: ainda não definido

## Objetivo
Levar quem visita a página a abrir uma conta digital (baixar o app e pedir o cartão).

## Público
Não informado.

## Tom e personalidade
Os que o Figma já expressa (direto, simples, "sem enrolação"). Não informado além disso.

## Design
- Link do Figma: <https://www.figma.com/design/7Faf4YNyYpe5fh0d3uWGD4/OrangeBank?node-id=0-1>
- Página de referência: `・ Desktop` (`551:428`), frame `landing page` (`844:957`, 1440 px).
- Escopo: **só desktop, tema claro.** Não há mobile nem dark no Figma; o responsivo (mobile e tablet) fica por conta do `builder`.
- Páginas de apoio: `・ Guia de estilos`, `・ Components`, `・ Favicon`.

## Textos: finais ou provisórios?
**Finais, os que estão no Figma.** **Decisão do dono: manter os textos do Figma como estão**; se algum parecer errado, avisar em vez de corrigir (o footer tem "Investimo", provável erro de digitação de "Investimentos").

## Seções e conteúdo
Na ordem do Figma: header, hero, sobre nós, tecnologias utilizadas, vantagens da conta, investimentos, cartão de crédito, perguntas frequentes (6 itens e "carregar mais"), chamada para baixar o app, footer. O frame tem ainda um texto escondido no hero (`hidden`), que deve ser ignorado.

## Idiomas
- Principal: pt-BR. Outros: nenhum.

## Publicação (deploy)
- Vercel, site estático. Ambientes: preview (branch `develop`) e produção (branch `main`). Domínio: ainda não definido.

## SEO e métricas
Título e descrição propostos pelo agente a partir do texto do hero. Sem métricas.

## Restrições
Nenhuma além do escopo desktop/light.

## Respostas do dono (G1)
- Deploy: Vercel, preview e produção.
- Público, e-mail e domínio: não informados; seguem como pendência opcional.
- Textos: o `designer` extrai do Figma e o `strategist` propõe; a aprovação do dono é no portão G2 (não é pergunta do intake).

## Pendências do dono (decisão G2: seguir com o conteúdo atual, 04/10/2026)
Todas as seções aprovadas como `ready` com o conteúdo incompleto da proposta do strategist (copy-proposal.md). Perguntas ainda sem resposta:
- Público opcional: quem abre uma conta digital no Orange Bank? (não informado; sem isso a seção segue genérica)
- Opcional: e-mail de contato e URL do domínio, quando houver.
- FAQ 3 a 6: quais as respostas reais para "Preciso pagar algo para abrir uma conta?", "Como colocar saldo na minha conta Orange Bank?", "Posso receber transferências na minha conta Orange Bank?" e "Qual descrição aparecerá na fatura do cartão de crédito?" (no Figma estão em Lorem ipsum)
- Sobre nós: aprovar a coluna 1 deduplicada? Qual o texto completo da coluna 2 ("...é possível realizar operações" está truncado)?
- Vantagem 02 menciona FDIC e saldo protegido em até $250,000 (banco dos EUA, em dólar). Manter, trocar ou remover? Qual a garantia real do Orange Bank?
- O menu tem "Conta Digital PJ", sem seção correspondente. Haverá página/seção PJ, o item muda de destino ou sai?
- "Tecnologias utilizadas" (logos HTML5, React, Java, AWS etc.) deve ir ao site do banco? Se sim, confirmar a lista de logos.
- Footer: endereço e CNPJ (Faria Lima 949, CNPJ 17.895.646/0001-87) são dados reais do Orange Bank ou de template? Confirmar também o ano do copyright (2024).
- Footer: "Investimo" (provável "Investimentos") mantido conforme decisão do dono; confirmar se segue assim.
- Links reais: App Store, Google Play, redes sociais (Instagram, Facebook, YouTube) e páginas do footer.
