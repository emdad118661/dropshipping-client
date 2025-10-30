import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function RequireRole({ children, roles = ['superadmin'] }) {
  const [state, setState] = useState({ loading: true, ok: false });
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!mounted) return;
        if (!res.ok) return setState({ loading: false, ok: false });
        const data = await res.json();
        setState({ loading: false, ok: roles.includes(data?.user?.role) });
      } catch {
        if (mounted) setState({ loading: false, ok: false });
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname, roles]);

  if (state.loading) return <div className="p-8 text-center">Checking access…</div>;
  if (!state.ok) return <Navigate to="/" replace />;
  return children;
}