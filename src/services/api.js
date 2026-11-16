import axios from "axios";

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
const hasValidApiUrl = /^https?:\/\/[^\s/?#]+(?::\d+)?(?:\/[^\s?#]*)?$/i.test(apiUrl);

export const API_ERROR_MESSAGE = hasValidApiUrl
  ? "Não foi possível acessar o servidor. Verifique sua conexão e a URL da API e tente novamente."
  : "Configure EXPO_PUBLIC_API_URL com o endereço HTTP ou HTTPS do backend e reinicie o Expo.";

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: { Accept: "application/json" },
});
let currentAuthToken = null;

export function setAuthToken(token) {
  currentAuthToken = token || null;
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

// Evita enviar chamadas relativas ao servidor web quando a API não foi configurada.
api.interceptors.request.use((config) => {
  if (!hasValidApiUrl) {
    return Promise.reject(new Error(API_ERROR_MESSAGE));
  }
  return config;
});

// Erro padronizado para as telas: código e mensagem dos contratos, ou indisponibilidade de rede.
export class AppError extends Error {
  constructor(codigo, mensagem, status) {
    super(mensagem);
    this.codigo = codigo;
    this.status = status;
  }

  get offline() {
    return this.codigo === "semConexao";
  }
}

export function toAppError(error) {
  if (error instanceof AppError) return error;
  const body = error?.response?.data;
  if (error?.response && body && typeof body.codigo === "string" && typeof body.mensagem === "string") {
    return new AppError(body.codigo, body.mensagem, error.response.status);
  }
  if (error?.response) {
    return new AppError("erroInterno", "Não foi possível concluir a operação. Tente novamente.", error.response.status);
  }
  return new AppError("semConexao", API_ERROR_MESSAGE);
}

async function uploadProfilePhoto(blob, contentType) {
  if (!hasValidApiUrl) throw new AppError("semConexao", API_ERROR_MESSAGE);
  try {
    const response = await fetch(`${apiUrl}/auth/perfil/foto`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": contentType || blob.type || "image/jpeg",
        ...(currentAuthToken ? { Authorization: `Bearer ${currentAuthToken}` } : {}),
      },
      body: blob,
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      if (body && typeof body.codigo === "string" && typeof body.mensagem === "string") {
        throw new AppError(body.codigo, body.mensagem, response.status);
      }
      throw new AppError("erroInterno", "Não foi possível enviar a foto. Tente novamente.", response.status);
    }
    return body;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("semConexao", API_ERROR_MESSAGE);
  }
}

async function call(request) {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw toAppError(error);
  }
}

const id = (value) => encodeURIComponent(String(value));

// Catálogo (CT1, CT3, CT6, CT7, CT22) e complemento de produtos por categoria.
export const catalogApi = {
  listProducts: () => call(api.get("/produtos")),
  listCategories: () => call(api.get("/categorias")),
  productsByCategory: (categoriaId) => call(api.get(`/categorias/${id(categoriaId)}/produtos`)),
  productsByClassification: (categoriaId, subcategoriaId) =>
    call(api.get(`/categorias/${id(categoriaId)}/subcategorias/${id(subcategoriaId)}/produtos`)),
  product: (produtoId) => call(api.get(`/produtos/${id(produtoId)}`)),
  // CT22: ofertas demonstrativas com o aviso que sempre acompanha a lista.
  listOffers: () => call(api.get("/produtos/ofertas")),
};

// Carrinho e compra demonstrativa (CT8, CT11, CT12, CT13, CT14 e CT15).
export const cartApi = {
  addItem: ({ carrinhoId, produtoId, quantidade }) =>
    call(api.post("/carrinhos/itens", { ...(carrinhoId ? { carrinhoId } : {}), produtoId, quantidade })),
  get: (carrinhoId) => call(api.get(`/carrinhos/${id(carrinhoId)}`)),
  setQuantity: (carrinhoId, produtoId, quantidade) =>
    call(api.patch(`/carrinhos/${id(carrinhoId)}/itens/${id(produtoId)}`, { quantidade })),
  removeItem: (carrinhoId, produtoId) => call(api.delete(`/carrinhos/${id(carrinhoId)}/itens/${id(produtoId)}`)),
  summary: (carrinhoId) => call(api.get(`/carrinhos/${id(carrinhoId)}/resumo`)),
  confirm: (carrinhoId, chaveIdempotencia, metodoPagamento) =>
    call(api.post(`/carrinhos/${id(carrinhoId)}/confirmacao-demonstrativa`, { chaveIdempotencia, metodoPagamento })),
};

export const authApi = {
  register: (dados) => call(api.post('/auth/cadastro', dados)),
  login: (email, senha) => call(api.post('/auth/login', { email, senha })),
  profile: () => call(api.get('/auth/perfil')),
  updateProfile: (dados) => call(api.patch('/auth/perfil', dados)),
  changePassword: (dados) => call(api.post('/auth/perfil/alterar-senha', dados)),
  uploadPhoto: uploadProfilePhoto,
  removePhoto: () => call(api.delete('/auth/perfil/foto')),
  deleteAccount: (senhaAtual) => call(api.delete('/auth/conta', { data: { senhaAtual } })),
  logout: () => call(api.post('/auth/logout')),
};

export const profilePhotoSource = version => ({
  uri: `${apiUrl}/auth/perfil/foto?v=${encodeURIComponent(String(version || 0))}`,
  headers: currentAuthToken ? { Authorization: `Bearer ${currentAuthToken}` } : {},
});

export default api;
