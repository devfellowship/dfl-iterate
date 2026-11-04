---
name: debug
description: >-
  Corrige um erro de tsc, lint ou Supabase na camada dona do erro e roda npm
  run check de novo. Use quando o check falhar ou o Table Editor não refletir
  a tela. Não reescreva a feature nem mude o plano aceito.
---

# Debug

1. Copie a mensagem de erro. Diga a camada dona: type, service, hook, página ou schema.
2. Corrija só essa causa. Um erro do Supabase sobre policy se investiga no SQL e no `user_id` gravado pelo service, não na página.
3. Rode `npm run check` de novo.
4. Se a correção exigir coluna, rota ou escopo diferentes do plano aceito, pare, regrave o plano e espere aceite. Não "aproveite" o erro para redesenhar a feature.

## Qualidade

A seção Debug de `docs/qualidade.md` passa inteira. A resposta mostra o erro original e o que mudou.
