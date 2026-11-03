# Guia de Loading, Erro e Empty State

## Quando usar este documento

Use sempre que você estiver renderizando dados vindos de hook de query.

Este guia padroniza UX e reduz bugs visuais no batch.

## Resumo em 5 pontos

- Toda tela com dados async precisa tratar estados explicitamente.
- Ordem padrão: loading -> erro -> vazio -> sucesso.
- `refetch` deve existir em estado de erro sempre que fizer sentido.
- Mensagens devem ser claras e curtas.
- Estado vazio não é erro: é um caso legítimo de sucesso.

---

## Ordem padrão de renderização

Padrão recomendado:

```tsx
const { data, isPending, isError, refetch } = useXxx();

if (isPending) return <LoadingState />;
if (isError) return <ErrorState onRetry={() => refetch()} />;
if (!data || (Array.isArray(data) && data.length === 0)) return <EmptyState />;

return <SuccessView data={data} />;
```

---

## Diferença entre Erro e Vazio

### Erro (`isError === true`)
- Falha técnica/funcional na busca.
- Exemplo: service deu `throw new Error(...)`.
- UI esperada: mensagem + ação de tentar novamente.

### Vazio (sucesso com lista vazia)
- Busca funcionou, mas não há itens.
- Exemplo: `[]`.
- UI esperada: explicação amigável ("Ainda não há itens...").

---

## Exemplo real do projeto (HomePage)

Arquivo: `src/pages/HomePage.tsx`

Fluxo usado:
- loading: "Carregando lições..."
- erro: "Não foi possível carregar as lições" + botão de retry
- sucesso: grid com cards

Esse é o padrão que as tasks do batch devem seguir.

---

## Boas práticas de mensagem

### Loading

Boa:
- "Carregando lições..."
- "Buscando ranking..."

Ruim:
- "Loading..." (genérico demais)
- sem feedback visual

### Erro

Boa:
- "Não foi possível carregar as lições."
- botão "Tentar de novo"

Ruim:
- mensagem técnica para usuário final (`TypeError: ...`)
- erro sem ação de recovery

### Empty

Boa:
- "Esta lição ainda não tem atividades cadastradas."
- CTA opcional (voltar, criar, atualizar)

Ruim:
- tela em branco
- parecer que o app travou

---

## Componentes de estado (sugestão)

Para manter consistência, você pode criar componentes simples:
- `LoadingState.tsx`
- `ErrorState.tsx`
- `EmptyState.tsx`

Isso evita copiar/colar blocos de JSX em várias páginas.

---

## Anti-patterns que devemos evitar

- pular `isPending` e renderizar `data.map(...)` direto;
- usar fallback silencioso que esconde erro;
- misturar mensagens de erro técnico com UX de usuário;
- tratar `[]` como se fosse erro;
- esquecer `refetch` em erro recuperável.

---

## Checklist rápido por tela

- [ ] Tem estado de loading?
- [ ] Tem estado de erro com ação?
- [ ] Tem estado vazio (quando aplicável)?
- [ ] Nomes e textos estão claros?
- [ ] Fluxo visual não "pisca" indevidamente?

Se todos "sim", a tela está no padrão.

