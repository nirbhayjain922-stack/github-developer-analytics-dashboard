import { createContext, useContext, useMemo, useState } from "react";
import {
  clearSession,
  getSession,
  loginUser,
  registerUser,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup: async (email, password) => {
        const session = await registerUser(email, password);
        setUser(session);
        return session;
      },
      login: async (email, password) => {
        const session = await loginUser(email, password);
        setUser(session);
        return session;
      },
      logout: () => {
        clearSession();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
