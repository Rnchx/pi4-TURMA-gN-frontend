import axios from "axios";

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
const hasValidApiUrl = /^https?:\/\/[^\s/?#]+(?::\d+)?(?:\/[^\s?#]*)?$/i.test(apiUrl);

export const API_ERROR_MESSAGE = hasValidApiUrl
  ? "Não foi possível acessar o servidor. Verifique sua conexão e a URL da API e tente novamente."
  : "Configure EXPO_PUBLIC_API_URL com o endereço HTTP ou HTTPS do backend e reinicie o Expo.";

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

// Evita enviar chamadas relativas ao servidor web quando a API não foi configurada.
api.interceptors.request.use((config) => {
  if (!hasValidApiUrl) {
    return Promise.reject(new Error(API_ERROR_MESSAGE));
  }
  return config;
});

export default api;
