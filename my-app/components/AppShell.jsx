"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import AgentWrapper from "./AgentWrapper";

export default function AppShell({ children }) {
  const { authenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="appShell">
      <header className="appHeader">
        <Link href="/" className="appLogo">
          Calendar App
        </Link>

        <nav className="appNav">
          {authenticated ? (
            <>
              <Link
                href="/choice"
                className={pathname === "/choice" ? "navLink active" : "navLink"}
              >
                Schedules
              </Link>
              <Link
                href="/calendar"
                className={pathname === "/calendar" ? "navLink active" : "navLink"}
              >
                Calendar
              </Link>
              <Link
                href="/task/management"
                className={
                  pathname === "/task/management" ? "navLink active" : "navLink"
                }
              >
                Categorii
              </Link>
              <button type="button" className="navLogout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="navLink">
                Login
              </Link>
              <Link href="/auth/register" className="navLink">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="appMain">
        {children}
      <AgentWrapper />
      </main>
    </div>
  );
}
