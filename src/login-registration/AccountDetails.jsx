import React, { useEffect, useState } from 'react';
import HeadSubhead from '../CommonComponents/HeadSubhead';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AccountDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!mounted) return;
        if (!res.ok) {
          setErr('You are not logged in');
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data?.user || null);
        }
      } catch (e) {
        if (mounted) setErr('Failed to load account');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="md:mx-auto mt-20 max-w-7xl mx-3">
        <HeadSubhead title="My Account" subtitle="Loading..." />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (err && !user) {
    return (
      <div className="md:mx-auto mt-20 max-w-7xl mx-3">
        <HeadSubhead title="My Account" subtitle="About you" />
        <div className="mt-10 p-4 rounded bg-red-50 text-red-600">{err}</div>
      </div>
    );
  }

  const Field = ({ label, value }) => (
    <div className="flex gap-2 py-1">
      <p className="font-bold min-w-[110px]">{label}:</p>
      <p className="text-gray-700">{value || '-'}</p>
    </div>
  );

  return (
    <div className="md:mx-auto mt-20 max-w-7xl mx-3">
      <HeadSubhead title="My Account" subtitle="About you" />
      <div className="md:flex mt-10 gap-10">
        <div className="flex-1">
          <Field label="Name" value={user?.name} />
          <Field label="Phone No" value={user?.phone} />
        </div>
        <div className="flex-1">
          <Field label="Email" value={user?.email} />
          <Field label="Address" value={user?.address} />
        </div>
      </div>
      {/* Optional: created at */}
      {user?.createdAt && (
        <p className="mt-6 text-sm text-gray-500">
          Member since: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default AccountDetails;