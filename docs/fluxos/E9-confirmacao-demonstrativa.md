# Fluxo do E9: Confirmação demonstrativa

**Feito quando (da Entrega 1):** A pessoa confirma um carrinho não vazio e vê a mensagem de compra demonstrativa concluída; com carrinho vazio, a aplicação impede a conclusão.

## Passos

1. A pessoa confirma o resumo no Aplicativo SAFRA.
2. O aplicativo bloqueia localmente a ação quando o resumo não contém itens.
3. Para carrinho não vazio, o aplicativo chama `CT15 confirmarCompraDemonstrativa` com chave de idempotência.
4. A API SAFRA relê `CT9 carrinhos`, `CT10 itensCarrinho` e `CT2 produtos` e recalcula o total.
5. A API SAFRA envia ao Serviço de Confirmação os dados validados por `CT16 gerarConfirmacaoDemonstrativa`.
6. O Serviço de Confirmação grava `CT17 comprasDemonstrativas` e `CT18 itensCompra` em uma única transação.
7. O Serviço de Confirmação devolve o identificador da compra e a mensagem demonstrativa; a API marca o carrinho como confirmado por `CT9 carrinhos`.
8. O aplicativo informa que a compra demonstrativa foi concluída e que não houve cobrança.

## Diagrama

```mermaid
sequenceDiagram
    actor Pessoa as Responsável pelas compras
    participant Frontend as Aplicativo SAFRA
    participant Backend as API SAFRA
    participant Banco as Banco SAFRA
    participant Java as Serviço de Confirmação

    Pessoa->>Frontend: confirma o resumo não vazio
    Frontend->>Backend: CT15 confirmarCompraDemonstrativa
    Backend->>Banco: CT9 carrinhos - validar aberto e não vazio
    Banco-->>Backend: CT9 carrinhos - carrinho
    Backend->>Banco: CT10 itensCarrinho - ler itens
    Banco-->>Backend: CT10 itensCarrinho - itens
    Backend->>Banco: CT2 produtos - revalidar preços
    Banco-->>Backend: CT2 produtos - produtos atuais
    Backend->>Java: CT16 gerarConfirmacaoDemonstrativa - carrinho validado
    Java->>Banco: CT17 comprasDemonstrativas - gravar compra
    Banco-->>Java: CT17 comprasDemonstrativas - compra persistida
    Java->>Banco: CT18 itensCompra - gravar itens
    Banco-->>Java: CT18 itensCompra - itens persistidos
    Java-->>Backend: CT16 gerarConfirmacaoDemonstrativa - compra e mensagem
    Backend->>Banco: CT9 carrinhos - marcar confirmado
    Banco-->>Backend: CT9 carrinhos - carrinho confirmado
    Backend-->>Frontend: CT15 confirmarCompraDemonstrativa - conclusão
    Frontend-->>Pessoa: mostra confirmação sem cobrança
```

**Contratos usados:** CT2 produtos, CT9 carrinhos, CT10 itensCarrinho, CT15 confirmarCompraDemonstrativa, CT16 gerarConfirmacaoDemonstrativa, CT17 comprasDemonstrativas, CT18 itensCompra.
