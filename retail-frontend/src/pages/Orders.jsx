import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import './Orders.css';

const STATUS_COLORS = {
  PENDING: 'warning', CONFIRMED: 'info', PREPARING: 'primary',
  DELIVERED: 'success', CANCELLED: 'danger'
};
const STATUS_ICONS = {
  PENDING: '⏳', CONFIRMED: '✅', PREPARING: '👨‍🍳',
  DELIVERED: '🎉', CANCELLED: '❌'
};

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.success ? '🎉 Order placed successfully! Check your email for confirmation.' : '');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    if (successMsg) setTimeout(() => setSuccessMsg(''), 5000);
  }, []);

  const handleReorder = async (orderId) => {
    setReordering(orderId);
    try {
      await api.post(`/orders/${orderId}/reorder`);
      window.location.href = '/cart';
    } catch (err) {
      alert(err.response?.data?.message || 'Reorder failed');
    } finally { setReordering(null); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <h1 className="section-title" style={{ marginBottom: 8 }}>My Orders</h1>
        <p className="section-subtitle" style={{ marginBottom: 32 }}>Your order history and tracking</p>

        {successMsg && <div className="alert alert-success" style={{ marginBottom: 24 }}>{successMsg}</div>}

        {orders.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '50vh' }}>
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Place your first order and enjoy delicious food!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card animate-fade-up">
                <div className="order-card__header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <div className="order-card__id">
                    <span className="order-num">Order #{order.id}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="order-card__meta">
                    <span className={`badge badge-${STATUS_COLORS[order.status]}`}>
                      {STATUS_ICONS[order.status]} {order.status}
                    </span>
                    <span className="order-total">₹{order.finalAmount}</span>
                    <span className="order-expand">{expandedOrder === order.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-card__detail animate-fade">
                    <div className="divider" />
                    
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.productId} className="order-item">
                          <img
                            src={item.productImage || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'}
                            alt={item.productName}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'; }}
                          />
                          <div className="order-item__info">
                            <p>{item.productName}</p>
                            <span>₹{item.unitPrice} × {item.quantity}</span>
                          </div>
                          <strong>₹{item.subtotal}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="divider" />

                    <div className="order-card__summary">
                      <div>
                        <p className="order-addr"><span>📍</span> {order.deliveryAddress}</p>
                        {order.couponCode && <p className="order-coupon">🏷️ Coupon: <strong>{order.couponCode}</strong></p>}
                      </div>
                      <div className="order-totals">
                        <div className="summary-row-sm">
                          <span>Subtotal</span><span>₹{order.totalAmount}</span>
                        </div>
                        {order.discountAmount > 0 && (
                          <div className="summary-row-sm" style={{ color: 'var(--success)' }}>
                            <span>Discount</span><span>− ₹{order.discountAmount}</span>
                          </div>
                        )}
                        <div className="summary-row-sm summary-row-sm--total">
                          <span>Total</span><span>₹{order.finalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="divider" />
                    <div className="order-card__actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleReorder(order.id)}
                        disabled={reordering === order.id}
                        id={`reorder-${order.id}`}
                      >
                        {reordering === order.id ? 'Reordering...' : '🔄 Reorder'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
