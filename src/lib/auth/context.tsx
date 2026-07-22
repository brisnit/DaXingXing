"use client";

// Demo auth context. Uses localStorage so the authenticated experience works
// with zero backend config. When Supabase is wired in, swap the implementation
// here — the rest of the app consumes this hook unchanged.
import * as React from "react";

export type Role = "user" | "manufacturer" | "admin";

export interface DemoUser {
  name: string;
  email: string;
  role: Role;
  company?: string;
}

interface AuthState {
  user: DemoUser | null;
  loading: boolean;
  signIn: (email: string, role?: Role) => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthState | null>(null);
const KEY = "dxx.demo.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<DemoUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const signIn = React.useCallback((email: string, role: Role = "user") => {
    const name =
      email.split("@")[0]?.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
      "Founder";
    const u: DemoUser = { name, email, role, company: "Independent" };
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
  }, []);

  const signOut = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem(KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
