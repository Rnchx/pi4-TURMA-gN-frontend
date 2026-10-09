# Definir o gerenciamento do estado global do aplicativo

## Status
Proposto

## Contexto
O Safra 2.0 possui fluxos como navegação por categorias, consulta de produtos e carrinho de compras. Conforme o aplicativo cresce, dados compartilhados entre diferentes telas — por exemplo, itens e quantidades do carrinho — precisam permanecer consistentes.

A equipe deverá avaliar se o estado local dos componentes é suficiente ou se é necessário um mecanismo compartilhado.

## Decisão
Manter o estado local nos componentes quando os dados forem utilizados apenas por uma tela.

Para dados compartilhados entre telas, como o carrinho, adotar uma solução de estado global após avaliar a complexidade real da aplicação e as necessidades de persistência.

A biblioteca específica não está definida nesta decisão e deverá ser escolhida antes de introduzir uma dependência.

## Alternativas consideradas
- **Estado local dos componentes:** simples e adequado para dados restritos a uma tela.
- **Context API do React:** disponível no ecossistema React e suficiente para determinados estados compartilhados.
- **Biblioteca dedicada de gerenciamento de estado:** pode facilitar cenários mais complexos, mas adiciona dependência e conceitos à aplicação.

## Consequências

### Positivas
- Orientação para evitar complexidade desnecessária em estados simples.
- Dados compartilhados podem permanecer consistentes entre telas.
- A escolha de uma biblioteca será baseada nas necessidades reais, em vez de ser antecipada sem justificativa.

### Negativas
- A equipe precisará definir e documentar a solução específica antes da implementação do estado compartilhado.
- Se o escopo crescer, a abordagem escolhida poderá precisar de revisão.