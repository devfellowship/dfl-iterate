---
name: schema-rls
description: >-
  Acrescenta tabela idempotente com RLS em supabase/schema.sql, só de um plano
  já aceito. Use depois do aceite, ao criar entries, tasks ou outra tabela do
  plano. Não reescreva profiles nem o trigger de signup.
---

# Schema e RLS

Só rode com plano aceito. Edite `supabase/schema.sql`. Não crie `seed.sql` e não insira usuário fixo.

1. Leia o plano aceito e o schema atual.
2. `create table if not exists` com as colunas do plano. `user_id uuid not null references auth.users (id)`.
3. `tasks.entry_id` referencia `entries (id) on delete cascade`.
4. `alter table ... enable row level security`.
5. Para cada ação (select, insert, update, delete): `drop policy if exists` e crie de novo. `USING` e `WITH CHECK` comparam `user_id` a `auth.uid()`.
6. Na policy de `tasks`, a entry pai também é do mesmo `auth.uid()` (o `entry_id` existe em `entries` com aquele `user_id`).
7. Não altere a tabela `profiles` nem o trigger em `auth.users`.

O fellow cola o arquivo no SQL Editor do projeto dele. O commit leva o SQL.

## Qualidade

A seção Schema de `docs/qualidade.md` passa inteira. Se faltar cascade ou `WITH CHECK`, corrija antes de seguir para o service.
