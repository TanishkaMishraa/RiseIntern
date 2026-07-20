import { createContext, useContext, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  async function login(credentials) {
    const result = await authApi.login(credentials);
    setUser(result.user);
    setToken(result.token);
    return result.user;
  }

  async function logout() {
    await authApi.logout(token);
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(user), login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
