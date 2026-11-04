---
name: plan-feature
description: >-
  Escreve docs/plans/<slug>.md para uma feature ou tabela nova e para até o
  fellow aceitar. Use quando o pedido cria entidade, tabela ou rota que ainda
  não está num plano aceito. Entries e tasks são um plano só. Não implemente
  nesta skill.
---

# Plano da feature

Grave o plano e pare. Sem código, sem branch de implementação, sem SQL aplicado.

1. Se a feature é o diário, o arquivo é `docs/plans/caderno.md` e cobre `entries` e `tasks` juntas.
2. Leia `docs/plans/profile.md` e copie o formato, não o conteúdo.
3. Escreva: tabelas e colunas com tipo, quem lê a linha, rotas, arquivos a criar, query keys, mutations e a key que cada uma invalida, fora de escopo com pelo menos dois itens.
4. A última linha é `Aguardando aceite`.
5. Mostre o caminho do arquivo no chat e pare.

Implemente só depois de "aceito", "pode executar" ou "ok, executa". Se a resposta mudar coluna, rota ou escopo, regrave o plano e espere de novo.

Correção dentro de um plano já aceito não usa esta skill.

## Qualidade

A seção Plano de `docs/qualidade.md` passa inteira antes de você dizer que o plano está pronto.
