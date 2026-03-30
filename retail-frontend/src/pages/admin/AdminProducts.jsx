import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import '../admin/Admin.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', imageUrl: '', stockQuantity: '', packaging: '', brand: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/admin/products'), api.get('/admin/categories')])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm({ name:'',description:'',price:'',categoryId:'',imageUrl:'',stockQuantity:'',packaging:'',brand:'' }); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ name:p.name, description:p.description||'', price:p.price, categoryId:p.category?.id || '', imageUrl:p.imageUrl||'', stockQuantity:p.stockQuantity, packaging:p.packaging||'', brand:p.brand||'' }); setEditing(p); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await api.put(`/admin/products/${editing.id}`, form);
      else await api.post('/admin/products', form);
      setMsg('✅ Saved successfully'); setShowForm(false); fetchData();
    } catch (err) { setMsg('❌ ' + (err.response?.data?.message || 'Error')); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/admin/products/${id}`); fetchData(); } catch { alert('Delete failed'); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="admin-header">
          <div>
            <h1 className="section-title">Products</h1>
            <p className="section-subtitle">{products.length} total products</p>
          </div>
          <div style={{ display:'flex', gap: 12 }}>
            <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
            <button className="btn btn-primary" onClick={openCreate} id="add-product-btn">+ Add Product</button>
          </div>
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>{msg}</div>}

        {/* Product Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <div className="divider" />
              <form onSubmit={handleSave} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select className="form-control" value={form.categoryId} onChange={e => setForm({...form, categoryId:e.target.value})} required>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" className="form-control" value={form.price} onChange={e => setForm({...form, price:e.target.value})} required min="0" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input type="number" className="form-control" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity:e.target.value})} required min="0" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Brand</label>
                    <input className="form-control" value={form.brand} onChange={e => setForm({...form, brand:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Packaging</label>
                    <input className="form-control" value={form.packaging} onChange={e => setForm({...form, packaging:e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input className="form-control" value={form.imageUrl} onChange={e => setForm({...form, imageUrl:e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="table-product">
                      <img src={p.imageUrl||'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'} alt={p.name}
                        onError={e => { e.target.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'; }} />
                      <div>
                        <p>{p.name}</p>
                        <span>{p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{p.category?.name || '—'}</span></td>
                  <td><strong style={{ color: 'var(--primary)' }}>₹{p.price}</strong></td>
                  <td>
                    <span className={`badge ${p.stockQuantity < 10 ? 'badge-danger' : 'badge-success'}`}>{p.stockQuantity}</span>
                  </td>
                  <td>
                    <span className={`badge ${p.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {p.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} id={`edit-product-${p.id}`}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} id={`delete-product-${p.id}`}>🗑️</button>
                    </div>
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
