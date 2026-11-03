## Por que estamos falando de Supabase agora?

Até aqui, o iterate “fingia” ter um backend:

```txt
componente → hook (React Query) → service → dummy em memória
```

Isso foi ótimo para aprender o fluxo horizontal sem depender de rede, auth ou banco. O dummy mora no processo do seu navegador/dev server: se você recarregar a página (ou reiniciar o `npm run dev`, dependendo do caso), parte do estado some ou volta ao valor inicial do arquivo.

No mundo real, o dado precisa viver **fora** do front: em um servidor, em um banco, acessível por várias pessoas e por várias sessões. É aí que entra o Supabase.

A ideia pedagógica desta etapa é simples, mas poderosa:

```txt
O React Query que você já aprendeu continua igual.
O que muda é só a “fonte da verdade” dentro do service.
```

Ou seja: você não joga fora a mutation que já entregou. Você **troca o miolo** do service — de “ler um array em memória” para “pedir ao Postgres via Supabase”.

---

## 1. O que é o Supabase, na prática?

Supabase é um **Backend as a Service (BaaS)**. Em português bem direto: alguém já montou a infraestrutura chata (banco, API, auth, painel) e você usa isso para focar no produto.

Por baixo dos panos, o coração é um **PostgreSQL** — um banco relacional clássico, o mesmo tipo de tecnologia que muita empresa usa em produção. O Supabase não inventa um “banco mágico”: ele **empacota** o Postgres com:

| Peça | O que significa na sua vida de fellow |
|---|---|
| **Database** | Tabelas, linhas, colunas — onde o dado mora de verdade |
| **API automática** | Você não precisa escrever um Express do zero só para dar `GET`/`POST` nas tabelas; o client JS fala com o banco |
| **Dashboard** | Interface web para ver dados, rodar SQL, copiar chaves |
| **Auth** (mais à frente) | Login, usuários, sessão — **ainda não é o foco desta aula** |
| **Storage / Edge Functions** (depois) | Arquivos e lógica no servidor — fora do escopo agora |

### Analogia útil

Pense no dummy como um caderno na sua mesa: só você vê, some se você virar a mesa.  
Pense no Supabase como um **quadro compartilhado na sala**: o mentor preparou as folhas (tabelas), todo mundo da turma pode ler/escrever (no sandbox de ensino), e o que foi escrito continua lá quando você fecha o notebook.

### O que vamos usar nesta aula

- Database (tabelas)
- Dashboard (Table Editor + SQL Editor + Settings)
- Client JS no front (`@supabase/supabase-js`) — detalhado na Wiki 2

**Ainda sem Auth.** Sem login. Sem “usuário logado de verdade”. Usamos um sandbox de turma com políticas abertas para aprendizado.

---

## 2. Projeto e dashboard — o mapa do território

### 2.1 Entrar no projeto da turma

1. Acesse [https://supabase.com](https://supabase.com) e faça login (conta que o mentor indicar, se necessário).
2. Abra o projeto da turma (**DFL Iterate** — o mentor passa o link/nome).
3. Nesta fase **você não precisa criar um projeto próprio**. Um projeto compartilhado reduz atrito: todo mundo aponta para o mesmo banco, vê as mesmas tabelas e consegue debugar junto.

Mais tarde, no Dev Journey, faz sentido cada um criar o próprio projeto. Agora o objetivo é **entender o caminho**, não operar DevOps.

### 2.2 Menus que importam nesta aula

Fique confortável com estes três lugares:

#### Table Editor

É a visão “planilha” do banco. Você vê linhas e colunas, consegue inspecionar se o seed (dados iniciais) está lá, e confirma se um `update` / `insert` que você fez pelo app realmente chegou no banco.

**Use o Table Editor como evidência.** Se a UI mudou mas a tabela não, o service ainda não está falando com o Supabase de verdade (ou falhou silenciosamente / você olhou a tabela errada).

#### SQL Editor

Aqui você (ou o mentor) roda comandos SQL: criar tabela, inserir seed, ajustar policy. Na aula, o mentor já prepara a maior parte. Mesmo assim, vale abrir e **ler** o SQL — não para virar DBA hoje, mas para não ter medo da sintaxe.

#### Project Settings → API

É de onde saem as “chaves da porta”:

- **Project URL** — endereço do seu projeto
- **anon / publishable key** — chave pública do client (front)
- **service_role** — chave poderosa de servidor (**proibida** no Vite/browser)

Sem essas duas primeiras, o front não sabe **para onde** falar nem **com qual identidade** de cliente público.

---

## 3. Tabelas, linhas e colunas — o vocabulário do banco

### 3.1 O que é uma tabela?

Uma tabela é uma coleção de **linhas** (registros) com o mesmo formato de **colunas** (campos).

Exemplo mental das preferências (task M2 / S-M2):

| user_id | theme | sound_effects_enabled | language |
|---|---|---|---|
| user-1 | dark | true | pt-BR |

Cada linha é “um pacote de preferências”. A coluna `user_id` identifica de quem é aquele pacote.

### 3.2 Por que o nome parece “estranho” (snake_case)?

No Postgres / Supabase é comum usar **snake_case**:

- `sound_effects_enabled`
- `occurred_at`
- `display_name`

No TypeScript do iterate vocês já usam **camelCase**:

- `soundEffectsEnabled`
- `occurredAt`
- `displayName`

Isso **não é bug**. São dois mundos com convenções diferentes. Quem faz a ponte é o **service** (na Wiki 2 você pratica esse mapa). Não force o banco a falar camelCase só porque o React fala camelCase — e não force o tipo TS a virar snake_case só porque o SQL usa underscore.

### 3.3 Primary key

Toda tabela precisa de uma forma de dizer “esta linha é única”. Isso é a **primary key**:

- Em preferências: `user_id`
- Em eventos, avisos e notificações: `id`
- No ranking e no perfil: `user_id` ou `id`
- No progresso: o par `user_id` + `lesson_id`

Se você tentar inserir duas linhas com a mesma primary key, o banco reclama. Isso é bom: protege a integridade dos dados.

### 3.4 Tipos de coluna (bem por cima)

Você vai ver coisas como:

- `text` — texto
- `boolean` — true/false
- `int` — número inteiro
- `timestamptz` — data/hora com fuso

Não precisa memorizar todos os tipos agora. Precisa olhar uma coluna e entender: “isso é texto ou número? isso é obrigatório (`not null`)?”

---

## 4. SQL mínimo — reconhecer, não decorar

SQL é a linguagem para conversar com o banco. O client do Supabase **gera** SQL/HTTP por baixo quando você chama `.select()`, `.insert()`, etc. Ainda assim, ler SQL te deixa menos perdido no dashboard e nos erros.

Abaixo está o “alfabeto” do CRUD.

### Create (estrutura) — criar tabela

O mentor já rodou algo parecido. Você só precisa **reconhecer**:

```sql
create table public.user_preferences (
  user_id text primary key,
  theme text not null,
  sound_effects_enabled boolean not null,
  language text not null
);
```

Leitura em português:

- “Crie a tabela `user_preferences`”
- “Ela tem estas colunas”
- “`user_id` é a chave”
- “as outras não podem ser nulas”

### Create (dado) — inserir linha

```sql
insert into public.user_preferences (user_id, theme, sound_effects_enabled, language)
values ('user-1', 'dark', true, 'pt-BR');
```

“Coloque uma linha nova com estes valores.”

### Read — ler

```sql
select * from public.user_preferences where user_id = 'user-1';
```

“Me devolva as colunas da linha cujo `user_id` é `user-1`.”

O `*` significa “todas as colunas”. Depois você pode ser mais específico e listar só o que precisa.

### Update — atualizar

```sql
update public.user_preferences
set theme = 'light'
where user_id = 'user-1';
```

O `where` é sagrado: sem ele, você pode atualizar **todas** as linhas da tabela. Sempre filtre.

### Delete — apagar

```sql
delete from public.activity_events where id = 'evt-1';
```

De novo: o `where` evita apagar o mundo.

### Ponte com o JavaScript

| Intenção | SQL | Client JS (Wiki 2) |
|---|---|---|
| Ler | `select` | `.select()` |
| Criar linha | `insert` | `.insert()` |
| Atualizar | `update` | `.update()` |
| Apagar | `delete` | `.delete()` |
| Filtrar | `where ...` | `.eq('coluna', valor)` |

Quando o erro do Supabase citar “row”, “constraint” ou “permission”, volte mentalmente a esta tabela: o problema quase sempre está numa dessas intenções.

---

## 5. Chaves de integração — URL e anon key

### 5.1 Onde ficam

No dashboard: **Project Settings → API**.

Você vai encontrar (nomes podem variar um pouco na UI):

| No dashboard | No iterate (`.env`) | Pode ir no front Vite? |
|---|---|---|
| Project URL | `VITE_SUPABASE_URL` | Sim |
| anon / publishable key | `VITE_SUPABASE_ANON_KEY` | Sim (é a chave **pública** do client) |
| service_role | — | **Nunca** no browser |

### 5.2 Por que duas coisas?

- A **URL** responde: “qual projeto / qual servidor?”
- A **anon key** responde: “sou um cliente público deste projeto”

Juntas, elas permitem que o `createClient` (já preparado no repo) abra a conversa com o banco.

### 5.3 O que o mentor faz / o que você faz

1. O mentor passa os valores no canal da turma.
2. Você coloca no arquivo **`.env` local** (não commitado).
3. Você **não** cola `service_role` em lugar nenhum do front.
4. Depois de salvar o `.env`, reinicia o `npm run dev` — o Vite lê env na subida do servidor.

Exemplo de formato (valores fictícios):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### 5.4 “Se a anon key é pública, por que não commitamos?”

Porque no sandbox da turma ela ainda é um **segredo de sala**: facilita abuso, bagunça o banco da aula e mistura ambientes. Em apps reais, a anon key aparece no bundle do browser — a proteção de verdade vem de **RLS + Auth**, não de esconder a anon key. Nesta aula, tratamos com cuidado de turma: canal privado + `.env` local.

---

## 6. RLS (Row Level Security) — o porteiro do banco

Mesmo com URL e anon key certas, o Postgres no Supabase pode dizer “não” se as **policies** não permitirem a operação.

RLS = regras do tipo: “quem pode ler/escrever qual linha?”

No sandbox da aula, o mentor configurou policies abertas para o papel `anon` (ensino **sem auth**). Isso é proposital e **não** é o modelo de produção.

### Como pensar quando der erro

Se a UI falha com mensagem de permissão / RLS / policy:

1. Não comece reescrevendo React Query.
2. Olhe se a tabela existe e tem seed (Table Editor).
3. Avise o mentor — muitas vezes é configuração do projeto, não “seu código está idiota”.

Mais à frente, com Auth, RLS vira o coração da segurança (“só o usuário X lê as linhas do usuário X”). Hoje, só precisa saber que **esse porteiro existe**.

---

## 7. Tabelas desta aula (o que o mentor preparou)

| Tabela | Liga com | Operações que você vai praticar |
|---|---|---|
| `user_preferences` | S-M2 | ler + atualizar |
| `activity_events` | S-M11 | listar + inserir |
| `leaderboard_entries` | S-M8 | listar + atualizar XP + ranks |
| `profiles` | S-M1 | ler + atualizar o objeto |
| `notifications` | S-M10 | listar + marcar 1 como lida |
| `announcements` | S-M3 | listar ativos + dispensar |
| `lesson_progress` | S-M5 | ler por lição + somar 1 atividade |

Cada fellow faz a tabela da própria task. O aprendizado é o mesmo: o hook não muda, o service troca o dummy pelo `supabase.from(...)`.

Antes de abrir o VS Code para a task, faça este ritual de 2 minutos:

1. Table Editor → abra a tabela da sua task  
2. Confirme que existem linhas (seed)  
3. Anote mentalmente os nomes das colunas (snake_case)

Se a tabela estiver vazia ou não existir, pare e fale com o mentor. Codar no escuro gasta energia à toa.

---

## 8. Banco compartilhado da turma — expectativa saudável

Vocês vão apontar para o **mesmo** projeto. Isso tem consequências boas e chatas:

**Bom**

- Todo mundo valida no mesmo lugar
- No feed (activity events), você pode ver inserts de outros fellows — prova viva de que o dado não está só na sua máquina

**Chato / esperado**

- Preferências, perfil, notificações e progresso do `user-1` podem ser alterados por várias pessoas
- Claim de XP no ranking do mesmo `user-1` pode “competir”
- Dispensar um aviso apaga a linha para a turma inteira
- Não é bug do seu código: é sandbox de sala

Trate como laboratório, não como produção.

---

## 9. Checklist antes de ir para a Wiki 2

Marque com sinceridade:

- [ ] Entendi por que saímos do dummy (persistência / fonte externa)
- [ ] Abri o projeto no dashboard
- [ ] Sei onde fica Table Editor, SQL Editor e Settings → API
- [ ] Sei a diferença entre URL, anon key e service_role
- [ ] Vi (ou vi o mentor mostrar) as tabelas da aula com seed
- [ ] Entendi que hooks React Query **não** são o foco desta troca — o service é
- [ ] Li o aviso de banco compartilhado sem surpresa

Quando isso estiver ok, parta para a prática:

→ [Supabase no iterate — integração prática](https://wiki.devfellowship.com/a/supabase-no-iterate-integracao-pratica)
