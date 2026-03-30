import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!isLoggedIn) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally { setAdding(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;
  if (!product) return <div className="page-wrapper"><div className="container empty-state"><div className="empty-state-icon">😔</div><h3>Product not found</h3><Link to="/menu" className="btn btn-primary">Back to Menu</Link></div></div>;

  const outOfStock = !product.isAvailable || product.stockQuantity === 0;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <Link to="/menu" className="back-link">← Back to Menu</Link>

        <div className="product-detail">
          <div className="product-detail__img-wrap">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'}
              alt={product.name}
              className="product-detail__img"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'; }}
            />
            {outOfStock && <div className="product-detail__oos">Out of Stock</div>}
          </div>

          <div className="product-detail__info animate-fade-up">
            <div className="product-detail__meta">
              <span className="badge badge-primary">{product.categoryName}</span>
              {product.brand && <span className="product-detail__brand">{product.brand}</span>}
              {product.packaging && <span className="badge badge-info">{product.packaging}</span>}
            </div>

            <h1 className="product-detail__name">{product.name}</h1>

            <p className="product-detail__desc">{product.description}</p>

            <div className="product-detail__price">₹{product.price}</div>

            <div className="product-detail__stock">
              {outOfStock
                ? <span className="badge badge-danger">Out of Stock</span>
                : <span className="badge badge-success">✓ In Stock ({product.stockQuantity} left)</span>
              }
            </div>

            {!outOfStock && (
              <div className="product-detail__qty">
                <span>Quantity:</span>
                <div className="qty-controls">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="qty-btn" id="qty-minus">−</button>
                  <span className="qty-value">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))} className="qty-btn" id="qty-plus">+</button>
                </div>
              </div>
            )}

            <div className="product-detail__actions">
              <button
                className={`btn btn-lg ${added ? 'btn-primary' : 'btn-primary'} ${added ? 'btn-added' : ''}`}
                onClick={handleAdd}
                disabled={outOfStock || adding}
                id="detail-add-to-cart-btn"
                style={{ flex: 1 }}
              >
                {added ? '✓ Added to Cart!' : adding ? 'Adding...' : `🛒 Add to Cart — ₹${(product.price * qty).toFixed(2)}`}
              </button>
              <Link to="/cart" className="btn btn-outline btn-lg">View Cart</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
