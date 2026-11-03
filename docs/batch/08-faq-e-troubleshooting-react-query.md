# FAQ e Troubleshooting — React Query (Batch)

## Quando usar este documento

Abra este arquivo quando sua task de dados "não funciona" e você não sabe por onde começar.

## Resumo em 5 pontos

- A maioria dos bugs vem de query key errada, import errado ou estado não tratado.
- Primeiro valide o básico: hook, service, query key, loading/erro.
- Use mensagens simples e retries claros.
- Evite adivinhar: inspecione estado e logs.
- Se pedir ajuda ao mentor, envie evidências objetivas.

---

## Problema 1 — "Nada aparece na tela"

### Possíveis causas

- você renderiza `data` sem tratar `isPending`;
- query nunca executa por parâmetro inválido;
- componente retorna `null` cedo demais.

### Como verificar

1. Logue no componente:
   ```ts
   console.log({ isPending, isError, data });
   ```
2. Veja se `isPending` fica true para sempre.
3. Confira se o parâmetro da query (id, lessonId etc.) está chegando.

### Como corrigir

- implementar bloco de loading;
- garantir que parâmetro existe antes de chamar query;
- usar defaults na desestruturação (`data: list = []`).

---

## Problema 2 — "isError nunca ativa"

### Causa comum

Service retorna `null` ou `undefined` em vez de `throw`.

### Exemplo errado

```ts
if (!lesson) return null;
```

### Exemplo correto

```ts
if (!lesson) throw new Error(`Lesson not found: ${id}`);
```

---

## Problema 3 — "refetch não muda nada"

### Causas comuns

- erro de query key (chave diferente da esperada);
- queryFn com closure antiga;
- componente não usando o estado atualizado.

### Checklist

- [ ] query key vem de `queryKeys.ts`?
- [ ] queryFn usa parâmetro atual?
- [ ] componente lê `data` do hook certo?

---

## Problema 4 — "Tenho dois caches para o mesmo dado"

### Causa

Chaves divergentes para o mesmo recurso, ex:

- `['lessons']`
- `['lesson']`
- `['lessons', { id }]` em lugar e `['lessons', id]` em outro.

### Solução

- padronizar tudo no factory `queryKeys.ts`;
- substituir chaves hardcoded por chamadas do factory.

---

## Problema 5 — "Hook dá erro de regra do React"

### Causa

Hook chamado fora de componente/hook, ou em condição.

### Exemplo errado

```ts
if (id) {
  const query = useLesson(id); // inválido
}
```

### Correto

```ts
const query = useLesson(id ?? '');
if (!id) return <Fallback />;
```

---

## Problema 6 — "A página pisca entre estados"

### Causa comum

Ordem de render inconsistente.

### Padrão recomendado

1. `isPending`
2. `isError`
3. empty state
4. sucesso

---

## Problema 7 — "Meu service tem lógica demais"

### Sinais de alerta

- service com JSX;
- service com `useState`/`useEffect`;
- service decidindo UI.

### Regra

Service é camada de dados. UI é responsabilidade da página/componente.

---

## Fluxo de diagnóstico rápido (5 minutos)

1. **Confirmar import/export**
   - hook exportado no barrel?
   - service exportado?

2. **Confirmar query key**
   - existe no `queryKeys.ts`?
   - hook usa exatamente essa key?

3. **Confirmar service**
   - `async`?
   - retorna tipo correto?
   - `throw` em erro?

4. **Confirmar UI**
   - trata `isPending`?
   - trata `isError`?
   - trata vazio?

5. **Rodar checagens**
   - `npx tsc --noEmit`
   - `npm run lint`

---

## O que enviar ao mentor quando pedir ajuda

Para acelerar suporte, de preferência, envie:

1. trecho ou nome do arquivo hook (`useXxx.ts`);
2. trecho trecho ou nome do arquivo service (`xxx.service.ts`);
3. trecho ou nome do arquivo da página/componente que consome;
4. (opcional mas acelera o entendimento) saída de:
   - `npx tsc --noEmit`
   - `npm run lint`
5. (opcional mas acelera o entendimento) print/descrição do comportamento esperado vs atual.

Isso não é um impeditivo para pedir ajuda! Mas sem isso, o diagnóstico fica mais lento.

---

## Mensagem pronta para pedir ajuda (copy/paste)

```md
Mentor, travei na task X.

Descrição do comportamento esperado:

- ...

Descrição do comportamento atual:

- ...

Arquivos que mexi:

- ...

Hipótese do problema:

- ...
```

---

## Último lembrete

React Query é novo, então é normal errar no início.
O importante neste bloco é manter disciplina de padrão.
