// Completa a última linha da grade de 2 colunas para o card ímpar manter a mesma largura dos demais.
export function padGrid(items, columns = 2) {
  const rest = items.length % columns;
  if (!rest) return items;
  return [...items, ...Array.from({ length: columns - rest }, (_, i) => ({ produtoId: `vazio-${i}`, vazio: true }))];
}
