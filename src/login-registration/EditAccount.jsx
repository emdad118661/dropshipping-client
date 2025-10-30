import React, { useEffect, useState } from 'react';
import HeadSubhead from '../CommonComponents/HeadSubhead';
import { TextInput, Label, Textarea } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function EditAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '',
    currentPassword: '', newPassword: '', confirmNewPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm(f => ({ ...f, [e.target.id]: e.target.value }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (!mounted) return;
        if (!res.ok) throw new Error('Not authorized');
        const data = await res.json();
        const u = data?.user || {};
        setForm(f => ({
          ...f,
          name: u.name || '',
          phone: u.phone || '',
          email: u.email || '',
          address: u.address || '',
          currentPassword: '', newPassword: '', confirmNewPassword: ''
        }));
      } catch (e) {
        setErr('Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSaving(true);
    try {
      // 1) Update profile fields
      const res1 = await fetch(`${API}/auth/me`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        })
      });
      const data1 = await res1.json();
      if (!res1.ok) throw new Error(data1.message || 'Failed to update profile');

      // 2) Optional password change
      const wantsPwChange = form.currentPassword || form.newPassword || form.confirmNewPassword;
      if (wantsPwChange) {
        if (!form.currentPassword) throw new Error('Current password is required');
        if (form.newPassword !== form.confirmNewPassword) throw new Error('New password & confirm do not match');
        if ((form.newPassword || '').length < 6) throw new Error('New password must be at least 6 characters');

        const res2 = await fetch(`${API}/auth/change-password`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword
          })
        });
        const data2 = await res2.json();
        if (!res2.ok) throw new Error(data2.message || 'Failed to change password');
      }

      setMsg('Profile updated successfully');
      // optional: navigate back after short delay
      setTimeout(() => navigate('/account'), 800);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='md:mx-auto mt-20 max-w-7xl mx-3'>
        <HeadSubhead title="Edit Account" subtitle="Update your information" />
        <div className="mt-10 h-10 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className='md:mx-auto mt-20 max-w-7xl mx-3'>
      <HeadSubhead title="Edit Account" subtitle="Update your information" />

      <form onSubmit={onSubmit} className="mt-8 grid md:grid-cols-2 gap-6 max-w-3xl">
        <div>
          <Label htmlFor="name" className="mb-1 block">Name</Label>
          <TextInput id="name" value={form.name} onChange={onChange} required />
        </div>

        <div>
          <Label htmlFor="phone" className="mb-1 block">Phone</Label>
          <TextInput id="phone" value={form.phone} onChange={onChange} />
        </div>

        <div>
          <Label htmlFor="email" className="mb-1 block">Email</Label>
          <TextInput id="email" value={form.email} readOnly disabled />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="address" className="mb-1 block">Address</Label>
          <Textarea id="address" rows={4} value={form.address} onChange={onChange} />
        </div>

        <div className="md:col-span-2 mt-2">
          <h3 className="font-semibold mb-2">Change password (optional)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currentPassword" className="mb-1 block">Current password</Label>
              <TextInput id="currentPassword" type="password" value={form.currentPassword} onChange={onChange} />
            </div>
            <div>
              <Label htmlFor="newPassword" className="mb-1 block">New password</Label>
              <TextInput id="newPassword" type="password" value={form.newPassword} onChange={onChange} />
            </div>
            <div>
              <Label htmlFor="confirmNewPassword" className="mb-1 block">Confirm new password</Label>
              <TextInput id="confirmNewPassword" type="password" value={form.confirmNewPassword} onChange={onChange} />
            </div>
          </div>
        </div>

        {err && <div className="md:col-span-2 text-red-600">{err}</div>}
        {msg && <div className="md:col-span-2 text-green-600">{msg}</div>}

        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn btn-neutral" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/account')} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}