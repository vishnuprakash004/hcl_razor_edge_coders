import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code:'', discountPercent:'', minOrderAmount:'', expiryDate:'', maxUses:'100' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchCoupons = () => {
    setLoading(true);
    api.get('/admin/coupons').then(r => setCoupons(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/admin/coupons', form);
      setMsg('✅ Coupon created!'); setShowForm(false); fetchCoupons();
      setForm({ code:'', discountPercent:'', minOrderAmount:'', expiryDate:'', maxUses:'100' });
    } catch (err) { setMsg('❌ ' + (err.response?.data?.message || 'Error')); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const toggleCoupon = async (id) => {
    try { await api.put(`/admin/coupons/${id}/toggle`); fetchCoupons(); } catch { alert('Toggle failed'); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="admin-header">
          <div>
            <h1 className="section-title">Coupons & Promotions</h1>
            <p className="section-subtitle">{coupons.filter(c => c.isActive).length} active coupons</p>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="create-coupon-btn">+ Create Coupon</button>
          </div>
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>{msg}</div>}

        {showForm && (
          <div className="admin-form-card">
            <h3 style={{ marginBottom: 20 }}>New Coupon</h3>
            <form onSubmit={handleCreate} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input className="form-control" value={form.code} onChange={e => setForm({...form, code:e.target.value.toUpperCase()})}
                    required placeholder="WELCOME20" id="coupon-code-input" />
                </div>
                <div className="form-group">
                  <label>Discount % *</label>
                  <input type="number" className="form-control" min="1" max="100" value={form.discountPercent}
                    onChange={e => setForm({...form, discountPercent:e.target.value})} required placeholder="20" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Min Order Amount (₹)</label>
                  <input type="number" className="form-control" value={form.minOrderAmount}
                    onChange={e => setForm({...form, minOrderAmount:e.target.value})} placeholder="200" />
                </div>
                <div className="form-group">
                  <label>Max Uses</label>
                  <input type="number" className="form-control" value={form.maxUses}
                    onChange={e => setForm({...form, maxUses:e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" className="form-control" value={form.expiryDate}
                  onChange={e => setForm({...form, expiryDate:e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Coupon'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Expiry</th><th>Uses</th><th>Status</th><th>Toggle</th></tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id}>
                  <td><strong style={{ color:'var(--accent)', letterSpacing:'0.05em' }}>{c.code}</strong></td>
                  <td><span className="badge badge-success">{c.discountPercent}% OFF</span></td>
                  <td>₹{c.minOrderAmount}</td>
                  <td>{c.expiryDate || '—'}</td>
                  <td>{c.usedCount}/{c.maxUses}</td>
                  <td><span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className={`btn btn-sm ${c.isActive ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => toggleCoupon(c.id)} id={`toggle-coupon-${c.id}`}>
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
