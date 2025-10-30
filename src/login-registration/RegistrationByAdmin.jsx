import React, { useState } from 'react';
import HeadSubhead from '../CommonComponents/HeadSubhead';
import { Checkbox, Label, TextInput, Textarea, Select } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const RegistrationByAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeName: '',
    employeeId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'admin',        // NEW: default role
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const onChange = (e) => {
    const { id, value, checked, type } = e.target;
    setForm(f => ({ ...f, [id]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!form.agree) return setErr('Please accept terms and conditions');
    if (form.password !== form.confirmPassword) return setErr('Passwords do not match');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await fetch(`${API}/admins`, {
        method: 'POST',
        credentials: 'include', // cookie for auth
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.employeeName,
          employeeId: form.employeeId,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
          role: form.role, // NEW: pass role
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create admin');

      setMsg('Admin created successfully');
      setTimeout(() => navigate('/account'), 800);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto mt-20 max-w-7xl'>
      <HeadSubhead
        title="Registration By Admin"
        subtitle="Create an admin/superadmin account for your team"
      />
      <form className="flex max-w-md flex-col gap-4 mt-5" onSubmit={onSubmit}>
        <div>
          <div className="mb-2 block"><Label htmlFor="employeeName">Employee name</Label></div>
          <TextInput id="employeeName" placeholder="Employee name" type="text" required shadow value={form.employeeName} onChange={onChange} />
        </div>

        <div>
          <div className="mb-2 block"><Label htmlFor="employeeId">Employee ID</Label></div>
          <TextInput id="employeeId" placeholder="Employee ID" type="text" required shadow value={form.employeeId} onChange={onChange} />
        </div>

        <div>
          <div className="mb-2 block"><Label htmlFor="email">Employee email</Label></div>
          <TextInput id="email" type="email" placeholder="name@example.com" required shadow value={form.email} onChange={onChange} />
        </div>

        <div>
          <div className="mb-2 block"><Label htmlFor="phone">Employee Phone Number</Label></div>
          <TextInput id="phone" placeholder="Employee Phone Number" type="text" required shadow value={form.phone} onChange={onChange} />
        </div>

        {/* NEW: Role field */}
        <div>
          <div className="mb-2 block"><Label htmlFor="role">Role</Label></div>
          <Select id="role" value={form.role} onChange={onChange} required>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </Select>
          <p className="text-xs text-gray-500 mt-1">Choose “superadmin” only for highest privileges.</p>
        </div>

        <div>
          <div className="mb-2 block"><Label htmlFor="password">Employee password</Label></div>
          <TextInput id="password" placeholder="Employee password" type="password" required shadow value={form.password} onChange={onChange} />
        </div>

        <div>
          <div className="mb-2 block"><Label htmlFor="confirmPassword">Employee repeat password</Label></div>
          <TextInput id="confirmPassword" placeholder="Repeat password" type="password" required shadow value={form.confirmPassword} onChange={onChange} />
        </div>

        <div className="max-w-md">
          <div className="mb-2 block"><Label htmlFor="address">Employee Address</Label></div>
          <Textarea id="address" placeholder="Write employee address..." required rows={4} value={form.address} onChange={onChange} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="agree" checked={form.agree} onChange={onChange} />
          <Label htmlFor="agree" className="flex">
            I agree with the&nbsp;<Link to="#" className="underline">terms and conditions</Link>
          </Label>
        </div>

        {err && <p className="text-red-600">{err}</p>}
        {msg && <p className="text-green-600">{msg}</p>}

        <button className="btn btn-neutral mt-4" disabled={loading}>
          {loading ? 'Creating…' : 'Register Your Account'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationByAdmin;