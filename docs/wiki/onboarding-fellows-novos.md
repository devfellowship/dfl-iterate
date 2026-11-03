# Onboarding — Fellows

> **Objetivo:** configurar o ambiente, estudar o básico com nossos cursos e praticar React inicial — componentes, hooks, estrutura — antes de entrar na camada de dados.

> **Documentação escrita** (padrões, tasks, Git/PR) fica na **Wiki DevFellowship**.

---

## Onde você está no programa (visão geral)

Fellows novos começam pelos estágios iniciais:

```txt
Estágio 1 — Versionamento & Colaboração     (Git/GitHub)
Estágio 2 — Fundamentos de React            (Vite, componentes, hooks, Tailwind)
        ↓
   (depois) React aplicado, react-query, services, Supabase, modelagem de dados…
```

## 1. O que instalar

| Ferramenta | Para quê | Link |
| --- | --- | --- |
| **Git** | Versionar código, branches, PRs | [git-scm.com](https://git-scm.com/downloads) |
| **Git Bash** (Windows) | Terminal com Git e comandos Unix | Instalado junto com o Git — marque a opção na instalação |
| **Node.js LTS** (20 ou 22) | Rodar React/Vite/npm | [nodejs.org](https://nodejs.org/) — ou [nvm](https://github.com/nvm-sh/nvm) |
| **Editor** | Cursor ou VS Code | Extensões úteis: ESLint, Prettier |
| **Conta GitHub** | Fork, clone, push, pull requests | [github.com](https://github.com) |
| **Navegador** | DevTools (F12) para inspecionar UI | Chrome ou Edge |

**Windows:** prefira o **Git Bash** para rodar os comandos deste guia (`git`, `npm`, `node`). No menu Iniciar, procure por “Git Bash”. No Mac/Linux, use o Terminal do sistema ou o terminal integrado do editor.

### Verificar se está ok

1. **Abra um terminal** — não rode na busca do Windows nem em bloco de notas:
   - **Windows:** Git Bash (recomendado) ou terminal do VS Code/Cursor (`Ctrl + '`)
   - **Mac/Linux:** Terminal ou terminal integrado do editor
2. **Digite ou cole** cada comando abaixo e pressione **Enter**.
3. **Esperado:** cada comando imprime um número de versão. Se aparecer `command not found` ou `não é reconhecido`, a instalação falhou ou o terminal errado está aberto.

```bash
git --version
node --version
npm --version
```

Exemplo de saída saudável:

```txt
git version 2.43.0
v22.11.0
10.9.0
```

---

## 2. Configurar o ambiente (dfl-iterate)

Use o repo da turma para **rodar e explorar** — sem precisar implementar task ainda.

Repositório oficial: [github.com/devfellowship/dfl-iterate](https://github.com/devfellowship/dfl-iterate)

### Antes do clone: fork no GitHub

Você **não** clona o repositório oficial direto para trabalhar. O fluxo é:

1. **Fork** do `dfl-iterate` para a **sua conta** GitHub (botão _Fork_ no GitHub).
2. **Clone do seu fork** — o código fica em `github.com/SEU-USUARIO/dfl-iterate`.
3. PRs saem **do seu fork** → repositório da organização (mentor revisa).

Passo a passo completo (fork, clone, remote, primeiro push): **Wiki DevFellowship → [Fork do Projeto](https://wiki.devfellowship.com/a/forking-project-workflow)**.

### Clone e rodar o projeto

No **Git Bash** (ou terminal), a partir da pasta onde você guarda projetos (ex.: `~/projetos`):

```bash
# 1. Clone do SEU fork (troque SEU-USUARIO)
git clone https://github.com/SEU-USUARIO/dfl-iterate.git
cd dfl-iterate

# 2. Instalar dependências do projeto
npm install

# 3. Executar aplicação em servidor local
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente `http://localhost:5173`).

### Manter o fork sincronizado com a `main` oficial

O repositório da org (`devfellowship/dfl-iterate`) recebe atualizações dos mentores. **Antes de criar branch ou abrir PR**, atualize seu fork para não trabalhar em cima de código velho.

**Opção A — pelo GitHub (mais simples):**

1. Abra **seu fork** no GitHub (`github.com/SEU-USUARIO/dfl-iterate`).
2. Se aparecer *“This branch is X commits behind devfellowship/dfl-iterate”*, clique em **Sync fork** → **Update branch**.

**Opção B — pelo terminal (configure uma vez o remote `upstream`):**

```bash
# Uma vez só, dentro da pasta do projeto clonado:
git remote add upstream https://github.com/devfellowship/dfl-iterate.git

# Sempre que for começar trabalho novo ou antes de abrir PR:
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

Se `git remote add upstream` der erro de remote já existente, pule essa linha — o `upstream` já está configurado.

### Comandos que você vai usar bastante

```bash
npm run dev          # app local
npm run lint         # checar estilo/erros
npx tsc --noEmit     # checar tipos TypeScript
npm run test         # testes (quando mentor pedir)
```

### Git — configurar uma vez

No mesmo terminal:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## 3. Por onde começar a estudar

### Ordem sugerida (cursos em vídeo — DevFellowship)

Siga nesta ordem. Assista **fazendo junto**, não só passivamente.

| Ordem | Curso | O que você aprende | Etapa do programa |
| --- | --- | --- | --- |
| **1** | **Git e GitHub para Iniciantes** | Repo, commit, branch, PR, conflitos | Estágio 1 |
| **2** | **React: Da Instalação ao Projeto Profissional (com React Query e Storybook)** | Ambiente, `useState`, props, rotas, estrutura de projeto; noções de React Query e Storybook no final | Estágio 2 |
| **3** | **Construindo um Website de E-Commerce com React JS, Vite e TailwindCSS** | Projeto maior: componentes, layout, Tailwind, integração em app real | Estágio 2 → reforço prático |

**Deixe para depois**:

| Curso | Quando |
| --- | --- |
| Vibe Coding: Wiki Gamer com Lovable e Cursor | Estágio 3 — React aplicado + IA |
| Dominando Supabase: Do Zero ao Deploy | Estágio 4 — Backend |
| Modelagem de Dados na prática… | Estágio 5 — Arquitetura de dados |

### Leitura na Wiki

Quando o mentor indicar, leia na **Wiki DevFellowship**:

| Página na Wiki | Quando ler |
| --- | --- |
| [Primeiros passos](https://wiki.devfellowship.com/a/primeiros-passos-chapter-webapps) | Trilha de conhecimento, preparar ambiente, fluxo de trabalho |
| [Fork do Projeto](https://wiki.devfellowship.com/a/forking-project-workflow) | Fork, clone, ambiente, fluxo GitHub |
| [Padrão Git — branches, commits e PR](https://wiki.devfellowship.com/a/padro-git-branches-commits-e-pull-requests-devfellowship) | Antes do primeiro PR (mesmo em mini-projeto) |
| [React Query — fundamentos](https://wiki.devfellowship.com/a/react-query-fundamentos-e-guia) | Aprofundamento |

### Explorar o código do iterate (somente leitura)

Com `npm run dev` rodando, abra no editor **arquivos de código**:

| Caminho no repo | O que observar |
| --- | --- |
| `src/components/activity/FixTheCode.tsx` | Componente “fino” — foco em UI |
| `src/hooks/useFixTheCode.ts` | Lógica no hook |
| `src/pages/HomePage.tsx` | Como a página monta blocos |
| `src/components/data-layer/` | Componentes só com props |

---

## 4. Colocar em prática

O batch atual é camada de dados. Para você, o foco é **prática inicial** em projeto próprio ou exercícios guiados. Abaixo estão algumas ideias e recomendações para praticar o que está aprendendo.

### Opção A — Mini-projeto pessoal (recomendado)

Crie um repo **seu** no GitHub, ex.: `meu-primeiro-react`:

**Ideias de escopo (1–2 semanas cada):**

| Projeto | O que pratica |
| --- | --- |
| **Landing page pessoal** | Componentes, Tailwind, props, responsivo |
| **Lista de tarefas (Todo)** | `useState`, listas com `.map()`, componentes filhos |
| **Card de perfil estático** | Props tipadas, composição (avatar + nome + bio) |
| **Galeria simples** | Array de dados mock, filtro com `useState` |
| **Formulário de contato** | Inputs controlados, validação básica |

**Estrutura de pastas sugerida** (igual aos cursos):

```txt
src/
├── components/     # UI reutilizável
├── hooks/          # lógica extraída (quando precisar)
├── pages/          # telas
├── types/          # interfaces TypeScript
└── main.tsx
```

O mentor revisa via **PR no seu repo** — use o padrão da Wiki: [Padrão Git — branches, commits e PR](https://wiki.devfellowship.com/a/padro-git-branches-commits-e-pull-requests-devfellowship).

### Opção B — Seguir os cursos em sequência

1. Termine **React: Da Instalação ao Projeto Profissional** (monte o projeto do curso).
2. Em seguida, **E-Commerce** — trate cada módulo como entrega: commit + PR (ou checkpoint com o mentor).

### Opção C — Explorar o iterate (somente leitura + anotações)

Sem alterar código de produção ainda:

1. Rode `npm run dev` e navegue Home + Lesson.
2. Abra `src/components/data-layer/` — veja componentes **só com props**.
3. Anote na sua wiki pessoal ou caderno: _“O que esse componente recebe? Como ele renderiza o visual de sucesso, de erro e em loading?”_

Quando o mentor liberar, você pode fazer PRs pequenos no **seu fork** (combinar escopo antes).

### Opção D — PR de treino no iterate (quando mentor autorizar)

Exemplos de escopo **pequeno e seguro**:

- `seu-nome/feat/exercicio-componente-X` — componente isolado (combinar com mentor antes)
- Ajustes combinados com o mentor — sempre via fork + PR

---

## 5. Checklist — “estou pronto para avançar?”

Converse com o mentor quando marcar a maioria:

- [ ] Git: sei criar branch, commit, push e abrir PR (do **meu fork**)
- [ ] React: componente funcional + props + `useState` + `useEffect`
- [ ] TypeScript: interface simples para props/dados
- [ ] Estrutura: sei onde colocar componente vs hook vs página
- [ ] iterate roda local (`npm run dev`) a partir do meu fork
- [ ] Sei sincronizar meu fork com a `main` oficial antes de trabalhar
- [ ] Li os documentos na Wiki direcionados para o Batch
- [ ] Curso Git concluído (ou quase)
- [ ] Curso **React: Da Instalação ao Projeto Profissional** em andamento avançado ou concluído

---

## 6. Dúvidas frequentes

**Onde está a documentação das tasks?**

Na **Wiki DevFellowship**, não no clone do GitHub. Peça os links ao mentor se ainda não tiver.

**Por que fork?**

Para você trabalhar na sua cópia e abrir PR sem push direto no repo da org. Detalhes: [Fork do Projeto](https://wiki.devfellowship.com/a/forking-project-workflow).

**Meu fork está desatualizado — o que faço?**

Use **Sync fork** no GitHub ou os comandos `git fetch upstream` + `git merge upstream/main` (seção [Manter o fork sincronizado](#manter-o-fork-sincronizado-com-a-main-oficial)).

**Posso copiar código do iterate no meu projeto?**

Pode estudar e se inspirar; o projeto de prática deve ser seu para você digitar e entender.

**React Query já?**

Só depois dos fundamentos. Nas tasks você usará — por isso o curso React Profissional e a Wiki de fundamentos vêm antes.

---
