"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/auth/login");
    }
  }, [authenticated, loading, router]);

  if (loading) {
    return (
      <div className="loadingScreen">
        <p>Se încarcă...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return children;
}
