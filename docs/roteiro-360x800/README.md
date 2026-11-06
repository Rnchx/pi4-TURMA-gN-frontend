# Roteiro de teste em 360 × 800 (OP#606 e OP#607)

Fluxo do E10: catálogo → categoria → detalhes → carrinho → resumo → confirmação, numa área visível de **360 × 800 px**, sem texto cortado, botão sobreposto, rolagem horizontal ou conteúdo escondido.

## Ambiente

- Frontend: Expo SDK 58 (web, Metro iniciado do zero com `--clear`), viewport emulado de 360 × 800.
- Backend: `docker compose up -d` (PostgreSQL 17.11, API SAFRA e Serviço de Confirmação em Java), catálogo demonstrativo com 58 produtos.
- `EXPO_PUBLIC_API_URL=http://localhost:4000`.

## Passos e resultado

| # | Passo | Esperado | Resultado | Captura |
|---|---|---|---|---|
| 1 | Abrir o app | Abertura animada da marca, faixa azul com a onda, 5 categorias em grade e catálogo em 2 colunas, vindos da API | OK; largura do documento = 360 (sem rolagem horizontal) | [01-home](01-home.jpg) |
| 2 | Tocar em "Padaria" e no filtro "Bolos" | Produtos da subcategoria (CT6) | OK; 5 produtos | [02-categoria-filtro](02-categoria-filtro.jpg) |
| 3 | Abrir "Bolo de Cenoura" | Imagem, classificação, preço, descrição, quantidade e "Adicionar" fixo no rodapé | OK | [03-detalhes](03-detalhes.jpg) |
| 4 | Tocar em "Adicionar" | Botão laranja "Adicionado", carrinho do cabeçalho anda com as linhas de velocidade, contador e aviso no topo sem cobrir ações | OK | [04-produto-adicionado](04-produto-adicionado.jpg) |
| 5 | Abrir o carrinho | Itens, preço unitário, quantidade, subtotais e total calculados pela API | OK | [05-carrinho](05-carrinho.jpg) |
| 6 | Aumentar quantidade e tocar em remover | Total atualizado pela API; diálogo de confirmação | OK | [06-remover-item](06-remover-item.jpg) |
| 7 | "Revisar compra" | Mesmos itens e total do carrinho; aviso de compra demonstrativa | OK | [07-resumo](07-resumo.jpg) |
| 8 | "Confirmar compra demonstrativa" | Número da compra, itens, total e mensagem sem cobrança; carrinho zerado | OK | [08-confirmacao](08-confirmacao.jpg) |
| 9 | Abrir o carrinho após a compra | Estado vazio com "Ver produtos" | OK | [09-carrinho-vazio](09-carrinho-vazio.jpg) |
| 10 | Abrir o menu | Início e Carrinho, aviso de compra demonstrativa | OK | [10-menu](10-menu.jpg) |
| 11 | Parar a API (`docker compose stop api`) e recarregar | Estado "Sem conexão" com "Tentar novamente"; nenhum erro de JavaScript | OK; ao religar a API, "Tentar novamente" recarrega 58 produtos | [11-sem-conexao](11-sem-conexao.jpg) |

Em todas as telas a largura do documento ficou em 360 px e o console do navegador não registrou erros de JavaScript com a API disponível. Com a API desligada, só aparecem as falhas de rede esperadas (`ERR_CONNECTION_REFUSED`).

## Como repetir

```bash
# backend
docker compose up -d
# frontend
EXPO_PUBLIC_API_URL=http://localhost:4000 npx expo start --web --clear
```

No navegador, use as ferramentas de desenvolvedor no modo dispositivo com 360 × 800 e percorra os passos acima. No iPhone, use o Expo Go do SDK 58 com `EXPO_PUBLIC_API_URL=http://<IP-do-computador>:4000` e `API_BIND_ADDRESS=0.0.0.0` no backend.
