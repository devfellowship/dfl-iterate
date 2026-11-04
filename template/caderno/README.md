# Caderno de bordo — spec do repositório template

Planta do template que os fellows vão usar como prova do bloco de dados.
Este diretório mora no `dfl-iterate` só como registro. O repositório novo
(`dfl-caderno`, GitHub template) nasce daqui. Nada disto altera o app iterate.

Status: decisões abaixo fechadas com o mentor. A estrutura de pastas está
registrada como planta do template.

## Ordem de leitura

| Arquivo | Conteúdo |
|---|---|
| [01-produto.md](./01-produto.md) | Tema, o que o starter traz, o que o fellow constrói, demo, rubrica |
| [02-estrutura.md](./02-estrutura.md) | Pastas, camadas, o que entra para ficar perto de um projeto real |
| [03-ia.md](./03-ia.md) | AGENTS.md, skills, aceite do plano, handoff entre chats |
| [AGENTS.md](./AGENTS.md) | Texto que vai para a raiz do template, pronto para copiar |

## Decisões fechadas

- As duas turmas fazem a mesma prova, depois que as duas tiverem praticado a troca do service para o Supabase.
- Repositório único, publicado como **GitHub template** ("Use this template").
- Tema: **Caderno de bordo**, diário de estudo do próprio fellow.
- Tabelas: `profiles` (pronta no starter), `entries`, `tasks`.
- Cada fellow cria o próprio projeto gratuito no Supabase, roda o SQL e preenche o `.env`. Confirmação de e-mail desligada no projeto de aula.
- Fatia ouro pronta: perfil (ler e atualizar), com loading, erro e mapper.
- O fellow constrói entradas e tasks no mesmo padrão.
- A IA executa git, código, `npm run check` e o texto do PR. O fellow lê o diff.
- Entidade nova: a IA escreve o plano e **espera o aceite** antes de implementar.
- Chat longo: a skill `handoff` grava `docs/handoff.md` para o próximo chat começar dali.
