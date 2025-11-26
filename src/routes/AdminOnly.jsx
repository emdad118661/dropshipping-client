import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default function AdminOnly({ children, redirect = "/" }) {
  const [state, setState] = useState({ loading: true, allow: false });
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: "include" });
        if (!alive) return;

        if (!res.ok) {
          setState({ loading: false, allow: false });
          return;
        }
        const data = await res.json();
        const role = data?.user?.role;
        const allow = role === "admin" || role === "superadmin";
        setState({ loading: false, allow });
      } catch {
        if (alive) setState({ loading: false, allow: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  if (state.loading) return <div className="p-8 text-center">Checking access…</div>;
  if (!state.allow)
    return <Navigate to={redirect} replace state={{ from: location.pathname }} />;

  return children;
}