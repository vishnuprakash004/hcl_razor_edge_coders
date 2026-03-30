import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const outOfStock = !product.isAvailable || product.stockQuantity === 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'}
          alt={product.name}
          className="product-card__image"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'; }}
        />
        {outOfStock && <div className="product-card__oos">Out of Stock</div>}
        {product.brand && <div className="product-card__brand">{product.brand}</div>}
      </div>

      <div className="product-card__body">
        <div className="product-card__category">{product.categoryName}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price}</span>
          {product.packaging && <span className="product-card__pack">{product.packaging}</span>}
        </div>

        <button
          className={`btn btn-primary btn-sm product-card__btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={outOfStock || adding}
          id={`add-to-cart-${product.id}`}
        >
          {added ? '✓ Added!' : adding ? 'Adding...' : outOfStock ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
