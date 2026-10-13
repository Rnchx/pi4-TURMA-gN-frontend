# Fluxo do E5: Controle de quantidades

**Feito quando (da Entrega 1):** A pessoa aumenta ou reduz a quantidade de um item e vê a nova quantidade no carrinho; a aplicação impede quantidade negativa.

## Passos

1. A pessoa escolhe aumentar ou reduzir a quantidade de um item.
2. O Aplicativo SAFRA impede o envio de quantidade menor que 1 e usa remoção explícita para retirar o item.
3. O aplicativo chama `CT12 alterarQuantidadeItem`.
4. A API SAFRA valida o carrinho em `CT9 carrinhos` e o produto em `CT2 produtos`.
5. A API SAFRA atualiza `CT10 itensCarrinho`.
6. A API SAFRA devolve o carrinho recalculado.
7. O aplicativo mostra a nova quantidade.

## Diagrama

```mermaid
sequenceDiagram
    actor Pessoa as Responsável pelas compras
    participant Frontend as Aplicativo SAFRA
    participant Backend as API SAFRA
    participant Banco as Banco SAFRA

    Pessoa->>Frontend: aumenta ou reduz a quantidade
    Frontend->>Backend: CT12 alterarQuantidadeItem
    Backend->>Banco: CT9 carrinhos - validar aberto
    Banco-->>Backend: CT9 carrinhos - carrinho
    Backend->>Banco: CT2 produtos - validar preço
    Banco-->>Backend: CT2 produtos - produto atual
    Backend->>Banco: CT10 itensCarrinho - atualizar quantidade
    Banco-->>Backend: CT10 itensCarrinho - item atualizado
    Backend-->>Frontend: CT12 alterarQuantidadeItem - carrinho recalculado
    Frontend-->>Pessoa: mostra a nova quantidade
```

**Contratos usados:** CT2 produtos, CT9 carrinhos, CT10 itensCarrinho, CT12 alterarQuantidadeItem.
