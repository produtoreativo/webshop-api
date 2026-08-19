# Feature: BI-01 — Webshop API BFF (Orquestração de Compra)
# Business Intent: O webshop-api orquestra o fluxo de compra expondo ao
# front-end capabilities de listagem, criação e consulta de pedidos.

Feature: Orquestração de Compra via BFF
  Como um front-end de e-commerce
  Eu quero consumir endpoints unificados do webshop-api
  Para que eu possa listar produtos, criar pedidos e consultar seu status
  sem depender diretamente dos serviços downstream

  # ── Listagem de Produtos ───────────────────────────────────────────────

  Scenario: Listagem de produtos disponíveis
    Given o search-api está disponível em SEARCH_API_URL
    When o front-end faz GET /produtos
    Then o webshop-api retorna 200
    And o corpo contém o campo "produtos" com uma lista de itens
    And cada item possui "id", "nome", "preco" e "disponivel"

  Scenario: Falha transiente no search-api
    Given o search-api retorna um erro 5xx
    When o front-end faz GET /produtos
    Then o webshop-api retorna 503
    And o header "Retry-After" é "5"
    And o corpo não expõe stack trace

  # ── Criação de Pedido ──────────────────────────────────────────────────

  Scenario: Criação de pedido com dados válidos
    Given o order-mngt-api está disponível em ORDER_API_URL
    And o front-end possui "productId", "customerId" e "correlationId"
    When o front-end faz POST /pedidos com o payload válido
    Then o webshop-api retorna 201
    And o corpo contém "pedidoId", "productId", "customerId", "correlationId" e "status: criado"

  Scenario: Idempotência na criação de pedido
    Given um pedido foi criado com correlationId "corr-abc"
    When o front-end repete POST /pedidos com o mesmo correlationId "corr-abc"
    Then o webshop-api retorna 201
    And o "pedidoId" retornado é o mesmo da requisição anterior

  Scenario: Rejeição de pedido sem productId
    Given o front-end não inclui "productId" no payload
    When o front-end faz POST /pedidos
    Then o webshop-api retorna 422
    And a chamada ao order-mngt-api não é realizada

  Scenario: Rejeição de pedido com productId vazio
    Given o front-end inclui "productId" vazio no payload
    When o front-end faz POST /pedidos
    Then o webshop-api retorna 422

  # ── Consulta de Pedido ─────────────────────────────────────────────────

  Scenario: Consulta de pedido existente
    Given existe um pedido com id "pedido-123" no order-mngt-api
    When o front-end faz GET /pedidos/pedido-123
    Then o webshop-api retorna 200
    And o corpo contém "pedidoId", "productId", "customerId", "correlationId" e "status"

  Scenario: Consulta de pedido inexistente
    Given não existe nenhum pedido com id "nao-existe" no order-mngt-api
    When o front-end faz GET /pedidos/nao-existe
    Then o webshop-api retorna 404
