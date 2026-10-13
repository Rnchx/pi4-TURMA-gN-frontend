# Fluxo do E2: Navegação por categorias e subcategorias

**Feito quando (da Entrega 1):** A pessoa seleciona uma das 4 categorias e uma subcategoria, vê somente os produtos correspondentes e consegue voltar à listagem anterior.

## Passos

1. A pessoa abre a navegação por classificação no Aplicativo SAFRA.
2. O aplicativo chama `CT3 listarCategoriasESubcategorias`.
3. A API SAFRA lê `CT4 categorias` e `CT5 subcategorias` no Banco SAFRA.
4. A pessoa escolhe uma das quatro categorias e depois uma subcategoria.
5. O aplicativo chama `CT6 listarProdutosPorClassificacao`.
6. A API SAFRA consulta `CT2 produtos` pelos identificadores recebidos.
7. O aplicativo mostra somente os produtos correspondentes.
8. A pessoa usa voltar e o aplicativo retorna à listagem anterior sem perder a classificação selecionada.

## Diagrama

```mermaid
sequenceDiagram
    actor Pessoa as Responsável pelas compras
    participant Frontend as Aplicativo SAFRA
    participant Backend as API SAFRA
    participant Banco as Banco SAFRA

    Pessoa->>Frontend: abre categorias e subcategorias
    Frontend->>Backend: CT3 listarCategoriasESubcategorias
    Backend->>Banco: CT4 categorias - listar ativas
    Banco-->>Backend: CT4 categorias - registros
    Backend->>Banco: CT5 subcategorias - listar ativas
    Banco-->>Backend: CT5 subcategorias - registros
    Backend-->>Frontend: CT3 listarCategoriasESubcategorias - hierarquia
    Pessoa->>Frontend: escolhe categoria e subcategoria
    Frontend->>Backend: CT6 listarProdutosPorClassificacao
    Backend->>Banco: CT2 produtos - filtrar classificação
    Banco-->>Backend: CT2 produtos - correspondentes
    Backend-->>Frontend: CT6 listarProdutosPorClassificacao - produtos
    Frontend-->>Pessoa: mostra o filtro e permite voltar
```

**Contratos usados:** CT2 produtos, CT3 listarCategoriasESubcategorias, CT4 categorias, CT5 subcategorias, CT6 listarProdutosPorClassificacao.
