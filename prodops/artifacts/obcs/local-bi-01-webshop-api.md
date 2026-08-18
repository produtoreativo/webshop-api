# Local OBC — BI-01: Compra de 1 item por Pix via Listagem

**Produto:** webshop-api (BFF — Backend for Frontend)
**Global OBC:** [global-bi-01-compra-pix-listagem.md](https://github.com/produtoreativo/prodops-portfolio/blob/prodops-workspace/prodops/artifacts/obcs/global-bi-01-compra-pix-listagem.md)
**Release:** 1.0.0
**Portfolio Issue:** [prodops-portfolio#5](https://github.com/produtoreativo/prodops-portfolio/issues/5)

---

## Status

Draft. Aguardando refinamento pelo Tech Lead. Rastreado em [webshop-api#18](https://github.com/produtoreativo/webshop-api/issues/18).

---

## Business Outcome

O webshop-api orquestra o fluxo de compra expondo ao front-end três capabilities: listagem de produtos (via search-api), criação de pedido (via order-mngt-api) e detalhe do pedido. Garante que o front-end tenha uma API unificada e resiliente, sem precisar conhecer os serviços downstream.

### Em linguagem executiva

É o gerente de loja que coordena o estoque (search-api) e o caixa (order-mngt-api): o front-end faz um único pedido ao gerente, que cuida de tudo o mais.

---

## Observable Events

| Event | Meaning | Required dimensions |
|---|---|---|
| `produtos.listados` | Listagem de produtos retornada com sucesso ao front-end | `count`, `correlationId` |
| `produtos.listagem_falhou` | Falha ao buscar listagem do search-api | `reason`, `correlationId` |
| `pedido.criado` | Pedido criado com sucesso via order-mngt-api | `pedidoId`, `customerId`, `productId`, `correlationId` |
| `pedido.criacao_falhou` | Falha ao criar pedido | `reason`, `correlationId` |
| `pedido.detalhado` | Detalhe do pedido retornado com sucesso | `pedidoId`, `correlationId` |

---

## Initial SLIs

| SLI | Initial target |
|---|---|
| `GET /produtos` responde em menos de 500ms (p95) | 99% |
| `POST /pedidos` responde em menos de 800ms (p95) | 99% |
| `GET /pedidos/:id` responde em menos de 300ms (p95) | 99.5% |
| Pedido duplicado (mesmo correlationId) retorna idempotente | 100% |

---

## Reliability Rules

- Toda chamada ao order-mngt-api inclui correlationId gerado pelo front-end; retentativa com mesmo correlationId não cria pedido duplicado.
- Em falha transiente do search-api (5xx), retornar 503 ao front-end com `Retry-After`; nunca retornar stack trace.
- Validar productId antes de chamar order-mngt-api; rejeitar com 422 se inválido.
- Nenhum dado de cartão, token de pagamento ou credencial de serviço é logado.

---

## Response Contract

```json
{
  "pedidoId": "uuid",
  "productId": "string",
  "status": "CRIADO",
  "criadoEm": "ISO8601"
}
```

---

## Related Artifacts

- BDD: `prodops/artifacts/bdd/bi-01-compra-pix-listagem.feature` *(a criar)*
- Iteration Plan: `prodops/artifacts/plans/iteration-plan.md`
- OBCs relacionados:
  - [local-bi-01-webshop](https://github.com/produtoreativo/webshop/blob/prodops-workspace/prodops/artifacts/obcs/local-bi-01-webshop.md) (consumidor)
  - [local-bi-01-search-api](https://github.com/produtoreativo/search-api) (dependência)
  - [local-bi-01-order-mngt-api](https://github.com/produtoreativo/order-mngt-api) (dependência)
