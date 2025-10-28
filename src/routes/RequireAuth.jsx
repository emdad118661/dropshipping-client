import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function RequireAuth({ children }) {
  const [ok, setOk] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!mounted) return;
        setOk(res.ok);
      } catch {
        if (!mounted) return;
        setOk(false);
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname]);

  if (ok === null) return <div className="p-8 text-center">Checking authentication…</div>;
  if (!ok) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}