import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">🍕 FoodieHub</div>
          <p>Fresh pizza, cold drinks, and artisan breads delivered to your door. Quality ingredients, unbeatable flavors.</p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Facebook">📘</a>
          </div>
        </div>

        <div className="footer__links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer__links">
          <h4>Categories</h4>
          <Link to="/menu?cat=1">🍕 Pizza</Link>
          <Link to="/menu?cat=2">🥤 Cold Drinks</Link>
          <Link to="/menu?cat=3">🍞 Breads</Link>
        </div>

        <div className="footer__links">
          <h4>Contact</h4>
          <span>📧 support@foodiehub.com</span>
          <span>📞 +91 98765 43210</span>
          <span>🕐 Mon–Sun: 10AM – 11PM</span>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© 2024 FoodieHub. All rights reserved. Made with ❤️ for food lovers.</p>
          <div className="footer__badges">
            <span>🔒 Secure Payments</span>
            <span>⚡ Fast Delivery</span>
            <span>🌟 Premium Quality</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
