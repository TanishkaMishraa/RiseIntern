import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = "riseintern.token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    authApi
      .getCurrentUser(storedToken)
      .then((currentUser) => {
        setUser(currentUser);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials) {
    const result = await authApi.login(credentials);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
    return result.user;
  }

  async function logout() {
    await authApi.logout(token);
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  function updateUser(patch) {
    setUser((current) => ({ ...current, ...patch }));
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(user), isLoading, login, logout, updateUser }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
