import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Landing.css';

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products').then(r => setFeatured(r.data.slice(0, 6))).catch(() => {});
    api.get('/products/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
        </div>
        <div className="container hero__content">
          <div className="hero__text animate-fade-up">
            <div className="hero__badge">🔥 Fresh & Hot Daily</div>
            <h1 className="hero__title">
              Delicious Food,<br />
              <span className="gradient-text">Delivered Fast</span>
            </h1>
            <p className="hero__subtitle">
              Explore our handcrafted pizzas, refreshing cold drinks, and freshly baked breads.
              Order in minutes, enjoy in comfort.
            </p>
            <div className="hero__actions">
              <Link to="/menu" className="btn btn-primary btn-lg" id="hero-order-btn">
                🍕 Order Now
              </Link>
              <Link to="/menu" className="btn btn-outline btn-lg">
                Browse Menu
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat"><span>500+</span><p>Happy Customers</p></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><span>15+</span><p>Menu Items</p></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><span>30 min</span><p>Avg Delivery</p></div>
            </div>
          </div>
          <div className="hero__visual animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="hero__pizza-wrapper">
              <div className="hero__pizza-ring" />
              <div className="hero__pizza-ring hero__pizza-ring--2" />
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"
                alt="Delicious Pizza"
                className="hero__pizza-img"
              />
              <div className="hero__float-card hero__float-card--1">
                <span>🚀</span>
                <div><p>Fast Delivery</p><span>30 mins</span></div>
              </div>
              <div className="hero__float-card hero__float-card--2">
                <span>⭐</span>
                <div><p>Top Rated</p><span>4.9 / 5</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
            <p className="section-subtitle">Handpicked for every craving</p>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <Link to={`/menu?cat=${cat.id}`} key={cat.id} className="category-card" id={`category-${cat.id}`}>
                <div className="category-card__img-wrap">
                  <img src={cat.imageUrl} alt={cat.name} onError={e => e.target.style.display='none'} />
                </div>
                <div className="category-card__body">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                </div>
                <span className="category-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Items</h2>
            <p className="section-subtitle">Our most loved dishes</p>
          </div>
          <div className="product-grid">
            {featured.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/menu" className="btn btn-outline btn-lg">View Full Menu →</Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose FoodieHub?</h2>
          </div>
          <div className="features-grid">
            {[
              { icon: '🍕', title: 'Premium Ingredients', desc: 'Hand-selected fresh ingredients sourced daily from local farms.' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Average delivery in 30 minutes. Hot food guaranteed every time.' },
              { icon: '🔒', title: 'Secure & Safe', desc: 'JWT-secured accounts. Your data and payments are always protected.' },
              { icon: '🎁', title: 'Loyalty Rewards', desc: 'Earn points on every order. Redeem for discounts and free items.' },
              { icon: '🏷️', title: 'Exclusive Coupons', desc: 'Regular promo codes and seasonal offers for our valued customers.' },
              { icon: '📦', title: 'Order Tracking', desc: 'Real-time status updates from confirmation to your doorstep.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner">
            <div>
              <h2>Ready to Order?</h2>
              <p>Use code <strong>WELCOME20</strong> for 20% off your first order!</p>
            </div>
            <Link to="/menu" className="btn btn-primary btn-lg" id="cta-order-btn">
              Start Ordering 🍕
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
