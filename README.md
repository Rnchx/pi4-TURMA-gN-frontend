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
    src="assets/design/images/banner-safra--light.png"
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
npm install
```

### 3. Configurar as variáveis de ambiente

Caso o projeto utilize variáveis de ambiente, crie um arquivo `.env` na raiz conforme as configurações esperadas pela aplicação.

Exemplo ilustrativo:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:PORTA
```

Substitua o endereço pelo endereço acessível do backend. Para testes em um dispositivo físico, normalmente será necessário utilizar o IP local do computador em vez de `localhost`.

Não inclua senhas, tokens privados ou outras credenciais sensíveis no repositório.

### 4. Iniciar a aplicação

```bash
npx expo start
```

Após iniciar, utilize o QR Code ou as opções do Expo para abrir a aplicação em um dispositivo compatível ou em um emulador configurado.

> Os comandos e as variáveis de ambiente podem precisar de ajustes de acordo com a configuração atual do repositório.

## Estrutura do projeto

A organização das pastas deve acompanhar a estrutura efetivamente adotada pela equipe. Uma organização de referência para o frontend é:

```text
frontend/
├── assets/          # Imagens, ícones e outros recursos visuais
├── src/
│   ├── components/  # Componentes reutilizáveis
│   ├── screens/     # Telas da aplicação
│   ├── navigation/  # Configuração da navegação
│   ├── services/    # Comunicação com a API
│   ├── contexts/    # Contextos e estados compartilhados, se utilizados
│   └── styles/      # Estilos e identidade visual
├── App.js           # Ponto de entrada, conforme configuração
├── package.json
└── README.md
```

Essa estrutura é apenas uma referência e deverá ser adaptada à organização real dos arquivos do projeto.

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
