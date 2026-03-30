import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Cart.css';

export default function Cart() {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponErr, setCouponErr] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true); setCouponErr('');
    try {
      const res = await api.post('/promotions/apply', {
        code: couponCode.toUpperCase(),
        orderAmount: cart.totalAmount,
      });
      setCouponData(res.data);
    } catch (err) {
      setCouponErr(err.response?.data?.message || 'Invalid coupon');
      setCouponData(null);
    } finally { setApplyingCoupon(false); }
  };

  const finalAmount = couponData ? couponData.finalAmount : cart.totalAmount;
  const discount = couponData ? couponData.discountAmount : 0;

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  if (cart.items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet. Let's fix that!</p>
            <Link to="/menu" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>Browse Menu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <h1 className="section-title" style={{ marginBottom: 8 }}>Shopping Cart</h1>
        <p className="section-subtitle" style={{ marginBottom: 36 }}>{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.cartItemId} className="cart-item animate-fade-up">
                <div className="cart-item__img-wrap">
                  <img
                    src={item.productImage || '#'}
                    alt={item.productName}
                    className="cart-item__img"
                    onError={e => { e.target.src = '#'; }}
                  />
                </div>
                <div className="cart-item__info">
                  <h4 className="cart-item__name">{item.productName}</h4>
                  <p className="cart-item__unit">₹{item.unitPrice} each</p>
                </div>
                <div className="cart-item__controls">
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => updateItem(item.cartItemId, item.quantity - 1)}
                      id={`qty-minus-${item.cartItemId}`}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateItem(item.cartItemId, item.quantity + 1)}
                      id={`qty-plus-${item.cartItemId}`}>+</button>
                  </div>
                  <span className="cart-item__subtotal">₹{item.subtotal}</span>
                  <button className="cart-item__remove" onClick={() => removeItem(item.cartItemId)}
                    id={`remove-${item.cartItemId}`} title="Remove">✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="cart-summary__card">
              <h3>Order Summary</h3>
              <div className="divider" />

              {/* Coupon */}
              <div className="coupon-section">
                <label className="coupon-label">🏷️ Have a coupon?</label>
                <div className="coupon-input-row">
                  <input
                    id="coupon-input"
                    type="text"
                    className="form-control"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponData(null); setCouponErr(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                  />
                  <button className="btn btn-outline btn-sm" onClick={applyCoupon}
                    disabled={applyingCoupon} id="apply-coupon-btn">
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponErr && <p className="coupon-error">{couponErr}</p>}
                {couponData && (
                  <p className="coupon-success">🎉 {couponData.discountPercent}% off applied!</p>
                )}
              </div>

              <div className="divider" />

              {/* Totals */}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cart.totalAmount}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Discount</span>
                  <span>− ₹{discount}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="divider" />
              <div className="summary-row summary-row--total">
                <span>Total</span>
                <span>₹{finalAmount}</span>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
                onClick={() => navigate('/checkout', { state: { couponCode: couponData ? couponCode : null, finalAmount } })}
                id="proceed-checkout-btn"
              >
                Proceed to Checkout →
              </button>

              <Link to="/menu" className="continue-shopping">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
