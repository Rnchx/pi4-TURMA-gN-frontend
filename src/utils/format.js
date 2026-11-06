// Formata valores já calculados pela API; o aplicativo nunca recalcula subtotal ou total.
export function money(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'R$ --';
  const [int, cents] = Math.abs(number).toFixed(2).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${number < 0 ? '-' : ''}R$ ${grouped},${cents}`;
}

export function units(count) {
  return count === 1 ? '1 unidade' : `${count} unidades`;
}

export function items(count) {
  return count === 1 ? '1 item' : `${count} itens`;
}

export function dateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} às ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Nomes vindos da base demonstrativa estão em minúsculas ou sem acento; só a primeira letra é ajustada.
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
