# Abrir o repositório

A planta e as skills estão fechadas. O que a aula precisa ver é o template
no ar, com o app abrindo. Criar o repositório é o próximo passo. Não falta
decisão de produto.

## Onde nasce

Repositório novo `dfl-caderno`, na organização, marcado como GitHub template.
A raiz dele recebe o conteúdo de [starter/](./starter/) mais o app descrito
em [02-estrutura.md](./02-estrutura.md). Este diretório no `dfl-iterate` continua
só como registro.

## Pronto para apresentar

- `npm run dev` abre `/login`, com criar conta, entrar e sair.
- Signup cria a linha em `profiles` pelo trigger. `/settings` lê e grava nome e tema, e o tema pinta a tela depois do refresh.
- `/` e `/entries/:id` abrem a casca, com a rota registrada.
- `npm run check` passa sem `.env` real, e o CI do template roda esse comando.
- README com o ritual: projeto gratuito, confirmação de e-mail desligada, colar `supabase/schema.sql`, preencher `.env`.
- `starter/` inteiro presente: `AGENTS.md`, `.cursor/skills/`, `docs/qualidade.md`, `docs/usando-a-ia.md`, `docs/plans/profile.md`.

Sem isso, a aula mostra documento. Com isso, o fellow cria o projeto no Supabase e pede o plano do caderno.
