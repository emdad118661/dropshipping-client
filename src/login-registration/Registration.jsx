import React, { useState } from 'react';
import HeadSubhead from '../CommonComponents/HeadSubhead';
import { Checkbox, Label, TextInput, Textarea } from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Registration() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', address: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) {
      setErr('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/'); // or /account
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='md:mx-auto mt-20 max-w-7xl mx-3'>
      <HeadSubhead title="Registration" subtitle="Create your own profile to take a close look at the exciting products" />
      <form className="flex max-w-md flex-col gap-4 mt-5" onSubmit={onSubmit}>
        <div>
          <div className="mb-2 block"><Label htmlFor="name">Your name</Label></div>
          <TextInput id="name" placeholder="Your name" type="text" required shadow value={form.name} onChange={onChange} />
        </div>
        <div>
          <div className="mb-2 block"><Label htmlFor="email">Your email</Label></div>
          <TextInput id="email" type="email" placeholder="name@example.com" required shadow value={form.email} onChange={onChange} />
        </div>
        <div>
          <div className="mb-2 block"><Label htmlFor="phone">Your Phone Number</Label></div>
          <TextInput id="phone" placeholder="Your Phone Number" type="text" required shadow value={form.phone} onChange={onChange} />
        </div>
        <div>
          <div className="mb-2 block"><Label htmlFor="password">Your password</Label></div>
          <TextInput id="password" placeholder="Your password" type="password" required shadow value={form.password} onChange={onChange} />
        </div>
        <div>
          <div className="mb-2 block"><Label htmlFor="confirm">Repeat password</Label></div>
          <TextInput id="confirm" placeholder="Repeat password" type="password" required shadow value={form.confirm} onChange={onChange} />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block"><Label htmlFor="address">Your Address</Label></div>
          <Textarea id="address" placeholder="Write your address..." required rows={4} value={form.address} onChange={onChange} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="agree" required />
          <Label htmlFor="agree" className="flex">
            I agree with the&nbsp;<Link to="#" className="underline">terms and conditions</Link>
          </Label>
        </div>
        {err && <p className="text-red-600">{err}</p>}
        <button className="btn btn-neutral mt-4" disabled={loading}>
          {loading ? 'Registering…' : 'Register Your Account'}
        </button>
      </form>
    </div>
  );
}