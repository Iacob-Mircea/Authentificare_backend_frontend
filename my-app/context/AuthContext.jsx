"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearTokens,
  isAuthenticated as checkAuth,
  loginUser,
} from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(checkAuth());
    setLoading(false);
  }, []);

  async function login(credentials) {
    const { response, data } = await loginUser(credentials);
    if (response.ok) {
      setAuthenticated(true);
      return { ok: true, data };
    }
    return { ok: false, data };
  }

  function logout() {
    clearTokens();
    setAuthenticated(false);
    router.push("/auth/login");
  }

  return (
    <AuthContext.Provider value={{ authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
