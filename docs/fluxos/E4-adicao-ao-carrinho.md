# Fluxo do E4: Adição ao carrinho

**Feito quando (da Entrega 1):** A pessoa adiciona um produto e recebe confirmação; ao abrir o carrinho, encontra o mesmo item com preço e quantidade corretos, sem duplicação indevida.

## Passos

1. A pessoa toca em adicionar na tela do produto.
2. O Aplicativo SAFRA chama `CT8 adicionarItemAoCarrinho` com produto e quantidade.
3. A API SAFRA lê o produto com `CT2 produtos` para validar o preço.
4. A API SAFRA cria ou lê o carrinho em `CT9 carrinhos`.
5. A API SAFRA inclui o item ou aumenta a linha existente em `CT10 itensCarrinho`, sem duplicá-la.
6. A API SAFRA devolve o carrinho atualizado e o aplicativo confirma a adição.
7. Ao abrir o carrinho, o aplicativo chama `CT11 consultarCarrinho` e mostra o mesmo item, preço e quantidade.

## Diagrama

```mermaid
sequenceDiagram
    actor Pessoa as Responsável pelas compras
    participant Frontend as Aplicativo SAFRA
    participant Backend as API SAFRA
    participant Banco as Banco SAFRA

    Pessoa->>Frontend: adiciona um produto
    Frontend->>Backend: CT8 adicionarItemAoCarrinho
    Backend->>Banco: CT2 produtos - validar preço
    Banco-->>Backend: CT2 produtos - produto atual
    Backend->>Banco: CT9 carrinhos - criar ou ler aberto
    Banco-->>Backend: CT9 carrinhos - carrinho
    Backend->>Banco: CT10 itensCarrinho - inserir ou somar quantidade
    Banco-->>Backend: CT10 itensCarrinho - item persistido
    Backend-->>Frontend: CT8 adicionarItemAoCarrinho - confirmação
    Frontend-->>Pessoa: confirma a adição
    Pessoa->>Frontend: abre o carrinho
    Frontend->>Backend: CT11 consultarCarrinho
    Backend-->>Frontend: CT11 consultarCarrinho - item sem duplicação
    Frontend-->>Pessoa: mostra item, preço e quantidade
```

**Contratos usados:** CT2 produtos, CT8 adicionarItemAoCarrinho, CT9 carrinhos, CT10 itensCarrinho, CT11 consultarCarrinho.
