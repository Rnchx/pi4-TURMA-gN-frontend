import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { authApi, setAuthToken } from "../services/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "safra.session.token";
let webToken = null;

const storage = {
  get: () => Platform.OS === "web" ? Promise.resolve(webToken) : SecureStore.getItemAsync(TOKEN_KEY),
  set: (value) => {
    if (Platform.OS === "web") { webToken = value; return Promise.resolve(); }
    return SecureStore.setItemAsync(TOKEN_KEY, value);
  },
  remove: () => {
    if (Platform.OS === "web") { webToken = null; return Promise.resolve(); }
    return SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoVersion, setPhotoVersion] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await storage.get();
        if (!token) return;
        setAuthToken(token);
        const data = await authApi.profile();
        if (active) setUsuario(data.usuario);
      } catch {
        setAuthToken(null);
        await storage.remove().catch(() => {});
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, senha) => {
    const data = await authApi.login(email, senha);
    await storage.set(data.token);
    setAuthToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const register = useCallback((dados) => authApi.register(dados), []);

  const clearSession = useCallback(async () => {
    await storage.remove().catch(() => {});
    setAuthToken(null);
    setUsuario(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const data = await authApi.profile();
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const updateProfile = useCallback(async (dados) => {
    const data = await authApi.updateProfile(dados);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const changePassword = useCallback(async (dados) => {
    await authApi.changePassword(dados);
    await clearSession();
  }, [clearSession]);

  const uploadPhoto = useCallback(async (asset) => {
    const blob = asset.blob || await fetch(asset.uri).then(response => response.blob());
    await authApi.uploadPhoto(blob, asset.mimeType || blob.type || "image/jpeg");
    await refreshProfile();
    setPhotoVersion(value => value + 1);
  }, [refreshProfile]);

  const removePhoto = useCallback(async () => {
    await authApi.removePhoto();
    await refreshProfile();
    setPhotoVersion(value => value + 1);
  }, [refreshProfile]);

  const deleteAccount = useCallback(async (senhaAtual) => {
    await authApi.deleteAccount(senhaAtual);
    await clearSession();
  }, [clearSession]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } finally { await clearSession(); }
  }, [clearSession]);

  const value = useMemo(() => ({ usuario, loading, photoVersion, login, register, logout, refreshProfile,
    updateProfile, changePassword, uploadPhoto, removePhoto, deleteAccount }),
  [usuario, loading, photoVersion, login, register, logout, refreshProfile, updateProfile, changePassword,
    uploadPhoto, removePhoto, deleteAccount]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return value;
}
