import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { cartApi } from "../services/api";
import { rememberProducts } from "./productCache";

const CartContext = createContext(null);

const EMPTY = { status: "aberto", itens: [], total: 0, carrinhoVazio: true };

// Chave única por tentativa lógica de confirmação (CT15), reaproveitada nas novas tentativas.
function newCheckoutKey() {
  const random = () => Math.random().toString(16).slice(2, 10).padEnd(8, "0");
  return `confirmacao-${Date.now().toString(16)}-${random()}${random()}`;
}

// Estado compartilhado do carrinho (ADR 0005: Context API). Valores monetários vêm sempre da API;
// o aplicativo apenas exibe subtotais e total devolvidos por CT8, CT11, CT12 e CT13.
export function CartProvider({ children }) {
  const [carrinhoId, setCarrinhoId] = useState(null);
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(() => new Set());
  const idRef = useRef(null);
  const keyRef = useRef(null);

  const applyCartId = (value) => {
    idRef.current = value;
    setCarrinhoId(value);
  };

  const mark = (produtoId, on) =>
    setPending((prev) => {
      const next = new Set(prev);
      if (on) next.add(produtoId);
      else next.delete(produtoId);
      return next;
    });

  const reset = useCallback(() => {
    applyCartId(null);
    keyRef.current = null;
    setCart(EMPTY);
    setError(null);
  }, []);

  // CT11: estado completo do carrinho.
  const refresh = useCallback(async () => {
    const id = idRef.current;
    if (!id) {
      setCart(EMPTY);
      return EMPTY;
    }
    setLoading(true);
    try {
      const data = await cartApi.get(id);
      setCart(data);
      setError(null);
      return data;
    } catch (err) {
      if (err.codigo === "carrinhoNaoEncontrado") {
        reset();
        return EMPTY;
      }
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reset]);

  // CT8: adiciona e soma quantidades no backend. Um carrinho já confirmado ou inexistente é substituído
  // por um novo carrinho de visitante, sem perder a ação da pessoa.
  const addItem = useCallback(async (product, quantidade = 1) => {
    rememberProducts([product]);
    mark(product.produtoId, true);
    try {
      let result;
      try {
        result = await cartApi.addItem({ carrinhoId: idRef.current, produtoId: product.produtoId, quantidade });
      } catch (err) {
        const stale = idRef.current && (err.codigo === "carrinhoFechado" || err.codigo === "recursoNaoEncontrado");
        if (!stale) throw err;
        result = await cartApi.addItem({ produtoId: product.produtoId, quantidade });
      }
      applyCartId(result.carrinhoId);
      keyRef.current = null;
      const data = await cartApi.get(result.carrinhoId).catch(() => null);
      if (data) setCart(data);
      setError(null);
      return result;
    } finally {
      mark(product.produtoId, false);
    }
  }, []);

  // CT12: quantidade entre 1 e 99; subtotal e total chegam recalculados.
  const setQuantity = useCallback(async (produtoId, quantidade) => {
    const id = idRef.current;
    if (!id) return null;
    mark(produtoId, true);
    try {
      const result = await cartApi.setQuantity(id, produtoId, quantidade);
      keyRef.current = null;
      setCart((prev) => ({
        ...prev,
        itens: prev.itens.map((item) => (item.produtoId === produtoId
          ? { ...item, quantidade: result.quantidade, precoUnitario: result.precoUnitario, subtotal: result.subtotal }
          : item)),
        total: result.total,
      }));
      return result;
    } finally {
      mark(produtoId, false);
    }
  }, []);

  // CT13: devolve o estado restante, inclusive o carrinho vazio.
  const removeItem = useCallback(async (produtoId) => {
    const id = idRef.current;
    if (!id) return null;
    mark(produtoId, true);
    try {
      const result = await cartApi.removeItem(id, produtoId);
      keyRef.current = null;
      setCart((prev) => ({ ...prev, itens: result.itens, total: result.total, carrinhoVazio: result.carrinhoVazio }));
      return result;
    } finally {
      mark(produtoId, false);
    }
  }, []);

  // CT14.
  const summary = useCallback(() => cartApi.summary(idRef.current), []);

  // CT15: a mesma chave é usada em todas as tentativas desta compra, evitando duplicidade.
  const confirm = useCallback(async () => {
    const id = idRef.current;
    keyRef.current ??= newCheckoutKey();
    const result = await cartApi.confirm(id, keyRef.current);
    reset();
    return result;
  }, [reset]);

  const value = useMemo(() => ({
    carrinhoId,
    cart,
    loading,
    error,
    pending,
    count: cart.itens.reduce((sum, item) => sum + item.quantidade, 0),
    refresh,
    addItem,
    setQuantity,
    removeItem,
    summary,
    confirm,
    reset,
  }), [carrinhoId, cart, loading, error, pending, refresh, addItem, setQuantity, removeItem, summary, confirm, reset]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider.");
  return context;
}
