# ADR 0001: Adotar React Native com Expo para o aplicativo móvel

**Status:** aceito

**Contexto:**

O Safra 2.0 é a reconstrução de um aplicativo de supermercado que permite navegar por categorias, consultar produtos, visualizar detalhes e gerenciar um carrinho de compras. O frontend precisa oferecer uma experiência móvel e permitir que a equipe desenvolva e teste a aplicação durante o Projeto Integrador. O grupo definiu React Native com Expo como base do frontend.

**Decisão:**

Adotar React Native com Expo para desenvolver o aplicativo móvel do Safra 2.0.

**Alternativas consideradas:**

- Desenvolvimento nativo separado para Android e iOS: não foi escolhido porque exigiria manter implementações específicas por plataforma, aumentando o esforço de desenvolvimento.
- Aplicação web responsiva: não foi escolhida porque a solução definida pelo grupo é um aplicativo móvel baseado em React Native.
- React Native sem Expo: não foi escolhido porque o grupo definiu Expo como parte da ferramenta de desenvolvimento.

**Consequências:**

- Positivas:
  - Permite compartilhar grande parte do código da interface entre plataformas móveis compatíveis.
  - O Expo oferece ferramentas que podem simplificar a configuração, execução e teste do aplicativo.
  - A equipe pode concentrar o desenvolvimento da interface e dos fluxos de compra em uma base de código compartilhada.

- Negativas:
  - A equipe precisará manter compatibilidade entre as versões do React Native, Expo e suas dependências.
  - Recursos nativos específicos podem exigir configuração adicional ou adaptações.
  - A equipe passa a depender das ferramentas e do ciclo de atualizações do ecossistema Expo.
