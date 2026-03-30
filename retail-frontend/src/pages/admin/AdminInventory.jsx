import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});
  const [updating, setUpdating] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    api.get('/admin/inventory').then(r => setProducts(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleUpdate = async (id) => {
    const qty = editing[id];
    if (qty === undefined || qty === '') return;
    setUpdating(id);
    try {
      await api.put(`/admin/inventory/${id}?quantity=${qty}`);
      setMsg('✅ Stock updated');
      fetchProducts();
    } catch { setMsg('❌ Update failed'); }
    finally { setUpdating(null); setTimeout(() => setMsg(''), 2000); }
  };

  const lowStock = products.filter(p => p.stockQuantity < 10);

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="admin-header">
          <div>
            <h1 className="section-title">Inventory</h1>
            <p className="section-subtitle">{lowStock.length} items low on stock</p>
          </div>
          <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>{msg}</div>}

        {lowStock.length > 0 && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            ⚠️ {lowStock.length} product(s) have low stock: {lowStock.map(p => p.name).join(', ')}
          </div>
        )}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Current Stock</th><th>Status</th><th>Update Stock</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="table-product">
                      <img src={p.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'}
                        alt={p.name} onError={e => { e.target.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'; }} />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{p.categoryName}</span></td>
                  <td>
                    <span className={`badge ${p.stockQuantity === 0 ? 'badge-danger' : p.stockQuantity < 10 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stockQuantity} units
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {p.isAvailable ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: 90 }}
                        min="0"
                        placeholder={p.stockQuantity}
                        value={editing[p.id] ?? ''}
                        onChange={e => setEditing({...editing, [p.id]: e.target.value})}
                        id={`stock-input-${p.id}`}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(p.id)}
                        disabled={updating === p.id} id={`update-stock-${p.id}`}>
                        {updating === p.id ? '...' : 'Update'}
                      </button>
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
