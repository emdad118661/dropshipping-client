import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderState = location.state || {};
  const { productId, qty = 1, size, color } = orderState;

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!productId) {
      setErr('No product selected. Please go back.');
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        // prefill from /auth/me
        const meRes = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (meRes.ok) {
          const me = await meRes.json();
          const u = me?.user || {};
          setForm(f => ({
            ...f,
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            address: u.address || '',
          }));
        }
        // load product
        const res = await fetch(`${API}/products/${productId}`);
        const p = await res.json();
        if (mounted) setProduct(p);
      } catch (e) {
        if (mounted) setErr('Failed to load checkout data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [productId]);

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const total = product ? Number(product.price || 0) * Number(qty) : 0;

  async function placeCOD() {
    setErr('');
    setMsg('');
    if (!form.name || !form.email || !form.phone || !form.address) {
      return setErr('Please fill all the fields');
    }
    setPlacing(true);
    try {
      const res = await fetch(`${API}/orders/cod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          qty,
          options: { size, color },
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      setMsg('Order placed successfully!');
      // optional: goto success page
      setTimeout(() => navigate(`/payment/success?orderId=${data.orderId}`), 900);
    } catch (e) {
      setErr(e.message);
    } finally {
      setPlacing(false);
    }
  }

  async function startStandardPayment() {
    setErr('');
    setMsg('');
    if (!form.name || !form.email || !form.phone || !form.address) {
      return setErr('Please fill all the fields');
    }
    try {
      // Create/init payment session (SSLCOMMERZ) — uses earlier /payments/init you added
      const res = await fetch(`${API}/payments/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: total,
          currency: 'BDT',
          cus_name: form.name,
          cus_email: form.email,
          cus_phone: form.phone,
          cus_address: form.address,
          // optional: you can create a pending order first and pass orderId
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || 'Failed to start payment');
      window.location.href = data.url; // redirect to gateway
    } catch (e) {
      setErr(e.message);
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto p-8">Loading checkout…</div>;
  if (err && !product) return <div className="max-w-3xl mx-auto p-8 text-red-600">{err}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-6 p-4 border rounded">
        <h2 className="font-semibold">Order summary</h2>
        <p className="mt-2"><span className="font-medium">Product:</span> {product?.name}</p>
        <p><span className="font-medium">Options:</span> {size || '-'} {color ? `• ${color}` : ''}</p>
        <p><span className="font-medium">Qty:</span> {qty}</p>
        <p className="mt-1 text-lg font-bold">Total: ৳{total}</p>
      </div>

      <form className="mt-6 grid gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Full name</label>
          <input id="name" className="input input-bordered w-full" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" type="email" className="input input-bordered w-full" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
          <input id="phone" className="input input-bordered w-full" value={form.phone} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">Shipping address</label>
          <textarea id="address" rows={4} className="textarea textarea-bordered w-full" value={form.address} onChange={onChange} required />
        </div>
      </form>

      {err && <p className="mt-3 text-red-600">{err}</p>}
      {msg && <p className="mt-3 text-green-600">{msg}</p>}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="btn btn-neutral flex-1" onClick={placeCOD} disabled={placing}>
          {placing ? 'Placing…' : 'Cash on Delivery'}
        </button>
        <button className="btn btn-primary flex-1" onClick={startStandardPayment}>
          Standard Payment
        </button>
      </div>
    </div>
  );
}