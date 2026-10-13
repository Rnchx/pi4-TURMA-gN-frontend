# Fluxo do E7: Subtotal e total da compra

**Feito quando (da Entrega 1):** A pessoa adiciona 2 unidades de R$ 5,50 e 1 de R$ 3,00 e vê R$ 14,00; ao retirar uma unidade do primeiro item, vê R$ 8,50, sem erro de centavos.

## Passos

1. A pessoa abre o carrinho depois de incluir os produtos do cenário.
2. O Aplicativo SAFRA chama `CT11 consultarCarrinho`.
3. A API SAFRA lê `CT9 carrinhos`, `CT10 itensCarrinho` e os preços em `CT2 produtos`.
4. A API SAFRA calcula cada subtotal e o total usando valores decimais, sem ponto flutuante binário.
5. A API SAFRA devolve subtotal de R$ 11,00, subtotal de R$ 3,00 e total de R$ 14,00.
6. A pessoa reduz a quantidade do primeiro item e o aplicativo usa `CT12 alterarQuantidadeItem`.
7. A API SAFRA recalcula e devolve o total de R$ 8,50.

## Diagrama

```mermaid
sequenceDiagram
    actor Pessoa as Responsável pelas compras
    participant Frontend as Aplicativo SAFRA
    participant Backend as API SAFRA
    participant Banco as Banco SAFRA

    Pessoa->>Frontend: abre o carrinho do cenário
    Frontend->>Backend: CT11 consultarCarrinho
    Backend->>Banco: CT9 carrinhos - ler carrinho
    Banco-->>Backend: CT9 carrinhos - carrinho
    Backend->>Banco: CT10 itensCarrinho - ler quantidades
    Banco-->>Backend: CT10 itensCarrinho - itens
    Backend->>Banco: CT2 produtos - ler preços
    Banco-->>Backend: CT2 produtos - preços
    Backend-->>Frontend: CT11 consultarCarrinho - total 14,00
    Pessoa->>Frontend: reduz uma unidade
    Frontend->>Backend: CT12 alterarQuantidadeItem
    Backend->>Banco: CT10 itensCarrinho - atualizar quantidade
    Banco-->>Backend: CT10 itensCarrinho - item atualizado
    Backend-->>Frontend: CT12 alterarQuantidadeItem - total 8,50
    Frontend-->>Pessoa: mostra os valores sem erro de centavos
```

**Contratos usados:** CT2 produtos, CT9 carrinhos, CT10 itensCarrinho, CT11 consultarCarrinho, CT12 alterarQuantidadeItem.
