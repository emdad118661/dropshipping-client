import React, { useState } from 'react';
import { TextInput, Label } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      const next = location.state?.from || new URLSearchParams(location.search).get('next') || '/';
      navigate(next, { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Welcome back!</p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form className="fieldset" onSubmit={onSubmit}>
              <Label htmlFor="email">Email</Label>
              <TextInput type="email" id="email" placeholder="Your Email..." value={form.email} onChange={onChange} />
              <Label htmlFor="password" className="mt-6">Password</Label>
              <TextInput type="password" id="password" placeholder="Your Password..." value={form.password} onChange={onChange} />
              {err && <p className="mt-2 text-red-600">{err}</p>}
              <button className="btn btn-neutral mt-4" disabled={loading}>
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}