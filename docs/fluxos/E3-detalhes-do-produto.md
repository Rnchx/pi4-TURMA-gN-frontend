# Fluxo do E3: Detalhes do produto

**Feito quando (da Entrega 1):** A pessoa abre um produto e vê nome, imagem, descrição e preço iguais aos dados desse item no catálogo.

## Passos

1. A pessoa seleciona um produto no Aplicativo SAFRA.
2. O aplicativo chama a API SAFRA com `CT7 consultarProduto`.
3. A API SAFRA consulta o Banco SAFRA com `CT2 produtos`.
4. A API SAFRA devolve os dados atuais do item.
5. O aplicativo apresenta nome, imagem, descrição e preço sem alterar os valores recebidos.

## Diagrama

```mermaid
sequenceDiagram
    actor Pessoa as Responsável pelas compras
    participant Frontend as Aplicativo SAFRA
    participant Backend as API SAFRA
    participant Banco as Banco SAFRA

    Pessoa->>Frontend: abre um produto
    Frontend->>Backend: CT7 consultarProduto
    Backend->>Banco: CT2 produtos - ler pelo ID
    Banco-->>Backend: CT2 produtos - produto
    Backend-->>Frontend: CT7 consultarProduto - detalhes
    Frontend-->>Pessoa: mostra nome, imagem, descrição e preço
```

**Contratos usados:** CT2 produtos, CT7 consultarProduto.
