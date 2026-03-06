import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import { loginRequest, meRequest, registerRequest } from "../../api/auth";
import { AuthContext } from "./auth-context";

const TOKEN_KEY = "stayhub_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        client.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
        const { data } = await meRequest();
        setToken(savedToken);
        setUser(data);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        delete client.defaults.headers.common.Authorization;
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(credentials) {
    const { data } = await loginRequest(credentials);

    localStorage.setItem(TOKEN_KEY, data.token);
    client.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    setToken(data.token);
    setUser({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
    });

    return data;
  }

  async function register(payload) {
    const { data } = await registerRequest(payload);
    return data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    delete client.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
