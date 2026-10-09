# Padronizar a comunicação com a API do projeto

## Status
Proposto

## Contexto
O frontend React Native com Expo precisa consumir os endpoints do backend principal em Node.js com Express.js. O backend poderá encaminhar determinadas operações a um serviço Java com Spring Boot executado em Docker.

Para evitar que a interface dependa dos detalhes internos dessa arquitetura, é importante definir um padrão para as chamadas à API.

## Decisão
Centralizar no frontend a configuração e a lógica compartilhada de comunicação HTTP com a API do projeto, incluindo a URL base por ambiente, serialização de dados, tratamento de erros e configuração de cabeçalhos.

O frontend deverá consumir preferencialmente os endpoints disponibilizados pelo backend principal. A comunicação com o serviço Java será intermediada pelo backend Node.js, salvo decisão arquitetural posterior em contrário.

Os contratos dos endpoints deverão ser documentados e mantidos consistentes.

## Alternativas consideradas
- **Centralizar a comunicação em um módulo de API:** reduz duplicação e facilita manutenção e testes.
- **Realizar chamadas HTTP diretamente em cada tela:** é simples no início, mas pode duplicar configurações e tratamento de erros.
- **Conectar o frontend diretamente a cada serviço de backend:** é possível, mas aumenta o acoplamento do aplicativo à topologia interna dos serviços.

## Consequências

### Positivas
- Configuração e tratamento de erros mais consistentes.
- Menor duplicação de código entre telas.
- Menor acoplamento do frontend à divisão interna dos serviços.
- Facilita substituir ou reorganizar serviços sem alterar cada tela do aplicativo.

### Negativas
- Será necessário manter um módulo compartilhado e sua documentação.
- Mudanças nos contratos da API precisarão ser coordenadas entre frontend e backend.
- As URLs e configurações por ambiente precisarão ser gerenciadas corretamente.