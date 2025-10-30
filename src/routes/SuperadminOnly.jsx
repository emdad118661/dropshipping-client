import { useEffect, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function SuperadminOnly({ children }) {
  const [state, setState] = useState({ loading: true, user: null, error: '' });
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!mounted) return;
        if (!res.ok) return setState({ loading: false, user: null, error: '' });
        const data = await res.json();
        setState({ loading: false, user: data?.user || null, error: '' });
      } catch {
        if (!mounted) return;
        setState({ loading: false, user: null, error: 'Failed to check auth' });
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname]);

  if (state.loading) {
    return <div className="p-8 text-center">Checking access…</div>;
  }

  // Not logged in → go to login
  if (!state.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Logged in but not superadmin → show message
  if (state.user.role !== 'superadmin') {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold">Forbidden</h2>
        <p className="mt-2 text-gray-600">Only superadmins can access this page.</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link to="/" className="btn btn-outline btn-sm">Go Home</Link>
          <Link to="/account" className="btn btn-neutral btn-sm">My Account</Link>
        </div>
      </div>
    );
  }

  // Superadmin → allow
  return children;
}