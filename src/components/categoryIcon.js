// Ícone por categoria; os nomes vêm da API (CT3). Categorias novas recebem o ícone de cesta.
const icons = {
  padaria: "baguette",
  "padaria e confeitaria": "cupcake",
  acougue: "food-steak",
  "acougue e peixaria": "food-steak",
  "horti-fruit": "carrot",
  hortifruti: "carrot",
  bebidas: "bottle-soda-outline",
  limpeza: "spray-bottle",
  "frios e laticinios": "cheese",
  mercearia: "food-variant",
  congelados: "snowflake",
  "higiene e limpeza": "spray-bottle",
  "utensilios domesticos e bazar": "silverware-fork-knife",
  "pet shop": "paw",
};

export function categoryIcon(nome = "") {
  const key = nome.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  return icons[key] || "basket-outline";
}

// Exibição com acentuação correta para os nomes da base demonstrativa, sem alterar os dados.
const labels = { acougue: "Açougue", "horti-fruit": "Hortifrúti" };

export function categoryLabel(nome = "") {
  const key = nome.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  return labels[key] || nome.charAt(0).toUpperCase() + nome.slice(1);
}
