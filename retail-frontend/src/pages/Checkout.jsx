import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { couponCode, finalAmount } = location.state || {};
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handlePlace = async (e) => {
    e.preventDefault();
    if (!address.trim()) { setError('Delivery address is required'); return; }
    setPlacing(true); setError('');
    try {
      await api.post('/orders/place', { deliveryAddress: address, couponCode: couponCode || null });
      await fetchCart();
      navigate('/orders', { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <h1 className="section-title" style={{ marginBottom: 8 }}>Checkout</h1>
        <p className="section-subtitle" style={{ marginBottom: 36 }}>Almost there! Confirm your order</p>

        <div className="checkout-layout">
          <form onSubmit={handlePlace} className="checkout-form">
            <div className="checkout-card">
              <h3 className="checkout-card__title">📍 Delivery Address</h3>
              <div className="form-group">
                <label htmlFor="delivery-address">Full Address</label>
                <textarea
                  id="delivery-address"
                  className="form-control"
                  rows={4}
                  placeholder="Enter your complete delivery address including flat no, street, city, pincode..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={placing}
              id="place-order-btn"
            >
              {placing ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="checkout-summary__card">
              <h3>Order Summary</h3>
              <div className="divider" />
              {cart.items.map(item => (
                <div key={item.cartItemId} className="co-item">
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'}
                    alt={item.productName}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60'; }}
                  />
                  <div className="co-item__info">
                    <p>{item.productName}</p>
                    <span>× {item.quantity}</span>
                  </div>
                  <strong>₹{item.subtotal}</strong>
                </div>
              ))}
              <div className="divider" />
              {couponCode && (
                <div className="summary-row" style={{ color: 'var(--success)' }}>
                  <span>🏷️ Coupon Applied</span>
                  <span>{couponCode}</span>
                </div>
              )}
              <div className="summary-row summary-row--total">
                <span>Total Payable</span>
                <span>₹{finalAmount || cart.totalAmount}</span>
              </div>
              <p className="checkout-note">🔒 Secure checkout — Your data is protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
