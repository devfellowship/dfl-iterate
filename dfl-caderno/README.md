# Caderno

Template da prova de camada de dados da DevFellowship. O app já sobe com login,
perfil e as rotas do diário em casca. Entries e tasks ficam para o fellow,
depois do aceite do plano.

## Subir local

1. Crie um projeto gratuito no [Supabase](https://supabase.com).
2. Em Authentication → Providers → Email, desligue **Confirm email**.
3. No SQL Editor, cole e rode `supabase/schema.sql`.
4. Em Project Settings → API, copie a URL e a chave **anon**.
5. Copie o ambiente e preencha:

```bash
cp .env.example .env
```

```txt
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

6. Instale e abra:

```bash
npm install
npm run dev
```

A tela de login fica em [http://localhost:5173/login](http://localhost:5173/login). Criar conta grava uma linha em `profiles`. Em Ajustes, nome e tema persistem depois do refresh. O tema escuro pinta a página.

A chave `service_role` não entra no `.env` do Vite.

## O que já está pronto

- Login: criar conta, entrar e sair.
- Perfil: `profile.service.ts`, `useGetProfile`, `useUpdateProfile`, `/settings`.
- Cascas em `/` e `/entries/:id`.
- `npm run check`: TypeScript, lint, teste do mapper e bloqueio de `service_role` no stage.

## Para a turma

Peça o plano do caderno. A IA grava `docs/plans/caderno.md` e espera um "aceito" antes de codar. A régua está em `docs/qualidade.md`. O uso da IA está em `docs/usando-a-ia.md`.
