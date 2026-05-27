"use client";

import { AuthProvider } from "../context/AuthContext";
import AppShell from "../components/AppShell";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
