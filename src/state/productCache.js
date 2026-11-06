// Guarda imagem e nome dos produtos já recebidos da API, para mostrar a foto dos itens do carrinho
// (CT11 não devolve imagem). A fonte dos dados continua sendo a API; nada aqui é catálogo fixo.
const cache = new Map();

export function rememberProducts(products) {
  for (const product of products || []) {
    if (product?.produtoId) cache.set(product.produtoId, { ...cache.get(product.produtoId), ...product });
  }
}

export function cachedProduct(produtoId) {
  return cache.get(produtoId);
}
