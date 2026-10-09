# ADR 0002: Utilizar React Navigation para gerenciar a navegação

**Status:** aceito

**Contexto:**

O Safra 2.0 possui diferentes telas e fluxos, incluindo a página inicial, categorias e subcategorias, detalhes de produtos e carrinho de compras. A aplicação precisa permitir que o usuário navegue entre essas telas de maneira consistente e que a equipe consiga manter essa estrutura conforme novas funcionalidades forem adicionadas. O grupo definiu React Navigation para gerenciar a navegação do frontend.

**Decisão:**

Utilizar React Navigation para implementar e organizar a navegação entre as telas do aplicativo Safra 2.0.

**Alternativas consideradas:**

- Implementar um sistema próprio de navegação: não foi escolhido porque exigiria desenvolver e manter manualmente comportamentos já oferecidos por uma biblioteca especializada.
- Utilizar outra biblioteca de navegação: não foi escolhida porque o grupo definiu React Navigation como solução para o projeto.
- Usar navegação baseada em páginas web: não foi escolhida porque o frontend é um aplicativo móvel desenvolvido com React Native.

**Consequências:**

- Positivas:
  - Permite estruturar e reutilizar fluxos de navegação entre telas.
  - Facilita a manutenção das rotas e da passagem de parâmetros entre telas.
  - Reduz a necessidade de implementar manualmente a lógica básica de navegação.

- Negativas:
  - A equipe precisará aprender e seguir os padrões de configuração e utilização da biblioteca.
  - Mudanças na estrutura de navegação podem exigir ajustes em telas, parâmetros e fluxos relacionados.
  - A compatibilidade da biblioteca com as versões do React Native e do Expo deverá ser considerada durante atualizações.
