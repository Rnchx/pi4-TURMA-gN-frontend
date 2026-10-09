# Implementar um fluxo de checkout com pagamento simulado

## Status

Proposto

## Contexto

Atualmente, a página de carrinho do Safra 2.0 apresenta os produtos selecionados e seus valores, mas a finalização da compra é realizada por meio de um alerta simples informando que a compra foi concluída.

Esse comportamento não representa adequadamente o fluxo de compra de um supermercado digital. Para fins acadêmicos, o projeto pretende oferecer uma experiência de checkout mais completa, permitindo revisar o pedido, selecionar um método de pagamento, preencher informações necessárias e visualizar a confirmação da compra.

A implementação terá caráter exclusivamente acadêmico. Não será necessário realizar transações financeiras reais nem integrar inicialmente um gateway de pagamento.

## Decisão

Implementar um fluxo estruturado de checkout integrado ao backend do projeto, contemplando:

- Revisão dos produtos, quantidades e valores do carrinho.
- Cálculo e apresentação do valor total do pedido.
- Seleção entre PIX e cartão como métodos de pagamento.
- Formulários específicos para cada método, com validação dos campos necessários.
- Exibição de um QR Code ou código PIX demonstrativo, sem realizar uma cobrança real.
- Utilização de dados fictícios de cartão, sem armazenar números completos de cartão ou códigos de segurança.
- Envio do pedido ao backend para validação e registro no PostgreSQL.
- Exibição de uma tela de confirmação com o resumo da compra e um identificador do pedido.

O backend Node.js será responsável por validar os itens, recalcular os valores com base nos dados oficiais dos produtos e registrar o pedido. O frontend não deverá ser a fonte definitiva dos preços nem do total da compra.

O sistema deverá identificar claramente que os pagamentos são simulados e não deverá solicitar dados financeiros reais.

## Alternativas consideradas

1. **Manter a finalização por alerta:** solução simples, mas que não oferece um fluxo de compra adequado.
2. **Implementar um checkout completo com pagamentos reais:** exigiria integração com um provedor de pagamentos, configurações adicionais e cuidados de segurança que não são necessários para o escopo acadêmico inicial.
3. **Implementar um checkout estruturado com pagamentos simulados:** oferece uma experiência mais completa, permite demonstrar validações e integração entre frontend, backend e banco de dados, sem movimentação financeira real.

## Consequências

### Positivas

- Melhora a experiência de compra e a usabilidade do aplicativo.
- Demonstra a integração entre React Native, Node.js e PostgreSQL.
- Permite praticar validação de formulários, regras de negócio e persistência de dados.
- Cria uma estrutura que poderá ser expandida futuramente.
- Permite demonstrar diferentes métodos de pagamento sem depender de serviços financeiros externos.

### Negativas

- Aumenta a complexidade do frontend e do backend.
- Exige a definição de regras para validação, registro e consulta de pedidos.
- Requer tratamento de erros de comunicação e prevenção de pedidos duplicados.
- O pagamento será apenas demonstrativo e não representará uma transação financeira real.
- Uma futura integração com pagamentos reais exigirá novas decisões de arquitetura, segurança e conformidade.