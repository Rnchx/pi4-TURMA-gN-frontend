# Integrar um assistente de IA ao aplicativo

## Status
Proposto

## Contexto
O Safra 2.0 considera a inteligência artificial como uma possível inovação para melhorar a experiência de compra. O aplicativo poderá apresentar uma interface para que o usuário solicite ajuda e receba respostas, recomendações ou sugestões relacionadas às compras.

O escopo exato da inteligência artificial e a tecnologia responsável pelo processamento ainda precisam ser definidos pela equipe.

## Decisão
Prever no frontend uma integração com um serviço de inteligência artificial por meio da API do projeto, sem conectar o aplicativo diretamente a provedores externos nem armazenar credenciais sensíveis no cliente.

A interface deverá apresentar estados de carregamento, resposta e erro. A implementação final dependerá da definição dos casos de uso e do contrato da API.

## Alternativas consideradas
- **Consumir a IA por meio da API do projeto:** centraliza a integração e permite que o backend controle o acesso ao serviço de IA.
- **Conectar o aplicativo diretamente a um provedor de IA:** poderia simplificar um protótipo, mas exporia credenciais e acoplaria o frontend ao provedor.
- **Não incluir IA no aplicativo:** reduziria a complexidade, mas deixaria de contemplar essa inovação caso ela seja confirmada no escopo.

## Consequências

### Positivas
- Possibilidade de oferecer assistência ou recomendações no fluxo de compras.
- Separação entre a interface e a implementação do serviço de IA.
- Maior controle sobre credenciais, validação e integração por meio do backend.

### Negativas
- A interface dependerá da disponibilidade e do contrato da API.
- Será necessário tratar latência, falhas e respostas inesperadas.
- O escopo e a tecnologia de IA ainda precisam ser definidos antes da implementação definitiva.