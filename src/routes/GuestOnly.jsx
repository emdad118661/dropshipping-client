// src/routes/GuestOnly.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function GuestOnly({ children, to = '/account', autoRedirect = true, delayMs = 1500 }) {
  const [isAuth, setIsAuth] = useState(null); // null = checking, true/false
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!mounted) return;
        setIsAuth(res.ok);
      } catch {
        if (!mounted) return;
        setIsAuth(false);
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname]);

  // Auto-redirect after showing message
  useEffect(() => {
    if (isAuth && autoRedirect) {
      const t = setTimeout(() => navigate(to, { replace: true }), delayMs);
      return () => clearTimeout(t);
    }
  }, [isAuth, autoRedirect, delayMs, to, navigate]);

  if (isAuth === null) {
    return <div className="p-8 text-center">Checking authentication…</div>;
  }

  // Already logged in → show message instead of blank
  if (isAuth) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold">You're already signed in</h2>
        <p className="mt-2 text-gray-600">
          {autoRedirect ? `Redirecting to ${to}…` : `You can't access this page while logged in.`}
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Link to={to} className="btn btn-neutral btn-sm">Go to Account</Link>
          <Link to="/" className="btn btn-outline btn-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  // Not logged in → render the actual page (login/registration)
  return children;
}