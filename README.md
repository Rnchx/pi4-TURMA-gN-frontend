# Safra Online

<picture>
  <source
    media="(prefers-color-scheme: light)"
    srcset="assets/design/images/banner-safra-readme-dark.png"
  />
  <source
    media="(prefers-color-scheme: dark)"
    srcset="assets/design/images/banner-safra-readme-light.png"
  />
  <img
    src="assets/design/images/banner-safra-readme-light.png"
    alt="Safra Online 2.0"
    width="100%"
  />
</picture>

Aplicativo de supermercado digital desenvolvido como parte do Projeto Integrador IV, com foco em proporcionar uma experiência de compra moderna, intuitiva e acessível.

## Sobre o projeto

O **Safra Online** é uma evolução do projeto Safra Online, desenvolvido com o objetivo de modernizar a experiência de compras em um supermercado digital.

A aplicação permite explorar categorias de produtos, visualizar informações detalhadas, adicionar itens ao carrinho e avançar pelo fluxo de compra. O projeto também prevê a evolução da experiência por meio de funcionalidades como assistência por inteligência artificial e um processo de checkout mais completo.

Este repositório contém o **frontend da aplicação**, desenvolvido com React Native e Expo, responsável pela interface e pela interação com o usuário.

O Safra Online é um projeto acadêmico desenvolvido no contexto do Projeto Integrador IV.

## Funcionalidades

- **Página inicial:** apresentação do supermercado, categorias e produtos em destaque.
- **Navegação por categorias:** exploração dos departamentos e subcategorias de produtos.
- **Detalhes dos produtos:** visualização de imagens, informações e opções de compra.
- **Carrinho de compras:** gerenciamento dos produtos selecionados e de suas quantidades.
- **Checkout:** evolução do fluxo de finalização da compra, incluindo seleção de método de pagamento e preenchimento de informações.
- **Assistente com inteligência artificial:** proposta de assistência durante a experiência de compra.
- **Identidade visual renovada:** interface modernizada, com componentes e elementos visuais padronizados.

> Algumas funcionalidades estão previstas para implementação ou evolução durante o desenvolvimento. A disponibilidade de cada recurso depende do estágio atual do projeto.

## Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React Native | Desenvolvimento da interface mobile |
| Expo | Ambiente e ferramentas para desenvolvimento e execução |
| React Navigation | Gerenciamento da navegação entre telas |
| JavaScript / TypeScript | Desenvolvimento da aplicação, conforme a configuração do projeto |
| npm | Gerenciamento de dependências |

## Arquitetura

O frontend se comunica com o backend por meio de uma API HTTP/REST, mantendo a interface desacoplada das regras de negócio e do acesso aos dados.

A arquitetura prevista para o projeto utiliza:

- **Frontend:** React Native + Expo.
- **Backend principal:** Node.js + Express.js.
- **Banco de dados:** PostgreSQL.
- **Serviço complementar:** Java + Spring Boot executado em um contêiner Docker.

O serviço Java será integrado ao backend Node.js por meio de comunicação HTTP/REST. Essa abordagem permite manter a estrutura atual do backend e incorporar o componente Java sem exigir uma migração completa da aplicação.

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- npm, normalmente instalado com o Node.js
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go/) para testar em um dispositivo compatível, ou um emulador configurado

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/Rnchx/pi4-TURMA-gN-frontend.git
```

Entre na pasta do projeto:

```bash
cd pi4-TURMA-gN-frontend
```

### 2. Instalar as dependências

```bash
npm ci
```

### 3. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` na raiz e ajuste `EXPO_PUBLIC_API_URL` para o endereço HTTP ou HTTPS do backend (sem barra final). Arquivos `.env*` são locais e ignorados pelo Git; nenhum IP fixo é versionado.

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

| Onde o app roda | Valor |
|---|---|
| Navegador no mesmo computador | `http://localhost:4000` |
| Android Emulator | `http://10.0.2.2:4000` |
| Celular na mesma rede (Expo Go) | `http://<IP-do-computador>:4000`, com `API_BIND_ADDRESS=0.0.0.0` no `.env` do backend |

O backend completo (PostgreSQL, API e serviço Java) sobe com `docker compose up -d` no repositório do backend.

Reinicie o Expo após alterar a variável. Variáveis `EXPO_PUBLIC_` ficam visíveis no aplicativo: não inclua senhas, tokens ou outras credenciais. Sem configuração válida ou com o servidor indisponível, as telas exibem uma mensagem e não criam produtos locais. As chamadas têm limite de 10 segundos.

### 4. Iniciar a aplicação

```bash
npx expo start
```

Após iniciar, utilize o QR Code ou as opções do Expo para abrir a aplicação em um dispositivo compatível ou em um emulador configurado.

Para iniciar a versão web:

```bash
npx expo start --web
```

O projeto usa **Expo SDK 58** (React Native 0.88, React 19.3, React Navigation 7, Reanimated 4 e Gesture Handler 3). No dispositivo, use o Expo Go do SDK 58 ou um development build. O backend deve permitir a origem web (CORS).

Para validar a instalação e os bundles:

```bash
npm ci
npx expo-doctor
npx expo export --platform android
npx expo export --platform web
```

As exportações ficam em `dist/`, ignorado pelo Git. O aplicativo usa somente as rotas oficiais dos contratos (`/produtos`, `/categorias`, `/carrinhos`).

## Estrutura do projeto

```text
frontend/
├── assets/                 # Ícones, logotipos e imagens da marca
├── docs/
│   ├── adr/                # Decisões de arquitetura
│   ├── fluxos/             # Fluxos E1–E12 (Entrega 2)
│   └── roteiro-360x800/    # Roteiro e capturas das telas em 360 × 800 (OP#607)
├── src/
│   ├── components/         # Componentes de domínio (card de produto, carrinho no cabeçalho, marca)
│   │   └── ui/             # Sistema visual: botões, chips, quantidade, skeletons, estados, aviso, diálogo
│   ├── routes/             # Drawer (React Navigation 7) e conteúdo do menu
│   ├── screens/            # Home, CategoryProducts, ProductDetails, Cart, Summary, Confirmation
│   ├── services/api.js     # Comunicação com a API (EXPO_PUBLIC_API_URL, tempo limite, erros)
│   ├── state/              # Carrinho compartilhado (Context API, ADR 0005)
│   ├── theme/              # Cores, tipografia, espaçamentos, bordas, sombras e movimento
│   └── utils/              # Formatação de valores e grade
├── App.jsx                 # Raiz: gestos, área segura, carrinho, avisos e navegação
└── package.json
```

## Sistema visual

- **Identidade:** verde-floresta (`#1E6B43`) como cor principal, fundos naturais (creme `#F7F5EF`) e o laranja da marca (`#F28C1E`) como destaque. Textos com contraste AA; laranja nunca é usado com texto branco.
- **Componentes:** todos os botões, cards, campos de quantidade, chips, estados (carregando, vazio, erro, sem conexão, sucesso), avisos e diálogos vêm de `src/components/ui`.
- **Movimento:** resposta ao toque com escala 0,97 em 120 ms (transição CSS do Reanimated 4), entradas com ease-out, carrinho com entrada e saída de itens e contador animado, selo de sucesso na confirmação. Com "Reduzir movimento" ligado no sistema, escalas e deslocamentos são desligados.
- **Toque e leitura:** áreas de toque de no mínimo 44 pt, rótulos de acessibilidade em todos os botões de ícone, controle de quantidade ajustável pelo leitor de tela e textos que acompanham o tamanho de fonte do sistema.

## Fluxo de compra

Catálogo (CT1) → categoria e subcategoria (CT3, CT6) → detalhes (CT7) → adicionar (CT8) → carrinho (CT11–CT13) → resumo (CT14) → confirmação demonstrativa (CT15). Subtotais e totais são sempre os devolvidos pela API; o aplicativo não recalcula valores. A confirmação usa a mesma chave de idempotência em novas tentativas, sem risco de compra duplicada. Nenhum pagamento é cobrado.

O roteiro de teste em 360 × 800 e as capturas estão em [`docs/roteiro-360x800`](docs/roteiro-360x800/README.md).

## Integração com o backend

O frontend utiliza o backend do Safra 2.0 para acessar os dados e executar operações relacionadas às regras de negócio.

Repositório do backend:

[pi4-TURMA-gN-backend-1](https://github.com/Rnchx/pi4-TURMA-gN-backend-1)

A URL da API deve ser configurada de acordo com o ambiente de execução. A aplicação não deve depender de endereços locais fixos para funcionar em outros ambientes.

## Decisões de arquitetura

As principais decisões técnicas do projeto são documentadas por meio de Architecture Decision Records (ADRs).

Os documentos ficam no diretório:

```text
docs/adr/
```

Cada ADR registra o contexto de uma decisão, a solução escolhida, as alternativas consideradas e suas consequências.

## Desenvolvimento acadêmico

**Projeto Integrador IV**

Projeto desenvolvido em equipe com o propósito de aplicar conhecimentos de desenvolvimento mobile, integração com APIs, arquitetura de software, persistência de dados e experiência do usuário.

## Licença

Projeto desenvolvido para fins acadêmicos. As condições de distribuição e reutilização deverão seguir as definições estabelecidas pela equipe e pela instituição de ensino.
