import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

const STATUS_OPTIONS = ['PENDING','CONFIRMED','PREPARING','DELIVERED','CANCELLED'];
const STATUS_COLORS = { PENDING:'warning', CONFIRMED:'info', PREPARING:'primary', DELIVERED:'success', CANCELLED:'danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/admin/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  const filtered = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="admin-header">
          <div>
            <h1 className="section-title">Manage Orders</h1>
            <p className="section-subtitle">{orders.length} total orders</p>
          </div>
          <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
        </div>

        {/* Filters */}
        <div className="category-filters" style={{ marginBottom: 24 }}>
          <button className={`cat-filter-btn ${filterStatus==='ALL'?'active':''}`} onClick={() => setFilterStatus('ALL')}>All</button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} className={`cat-filter-btn ${filterStatus===s?'active':''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>

        <div className="orders-list">
          {filtered.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card__header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="order-card__id">
                  <span className="order-num">Order #{order.id}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
                </div>
                <div className="order-card__meta">
                  <span className={`badge badge-${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <span className="order-total">₹{order.finalAmount}</span>
                  <span className="order-expand">{expanded === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === order.id && (
                <div className="order-card__detail animate-fade">
                  <div className="divider" />
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.productId} className="order-item">
                        <img src={item.productImage || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'}
                          alt={item.productName} onError={e => { e.target.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'; }} />
                        <div className="order-item__info"><p>{item.productName}</p><span>× {item.quantity}</span></div>
                        <strong>₹{item.subtotal}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="divider" />
                  <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:12 }}>
                    📍 {order.deliveryAddress}
                  </p>
                  <div className="admin-status-row">
                    <span style={{ fontSize:'0.9rem', fontWeight:600 }}>Update Status:</span>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {STATUS_OPTIONS.map(s => (
                        <button key={s}
                          className={`btn btn-sm ${order.status === s ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => updateStatus(order.id, s)}
                          disabled={updating === order.id || order.status === s}
                          id={`status-${order.id}-${s}`}
                        >
                          {updating === order.id ? '...' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders</h3></div>
          )}
        </div>
      </div>
    </div>
  );
}
