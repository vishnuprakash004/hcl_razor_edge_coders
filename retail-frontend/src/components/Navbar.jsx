import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="logo-icon">🍕</span>
          <span>FoodieHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
          {isLoggedIn && <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>My Orders</Link>}
          {isAdmin && <Link to="/admin" className="nav-link nav-link--admin">Admin</Link>}
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="cart-btn" id="cart-icon-btn">
                <span>🛒</span>
                {cart.totalItems > 0 && (
                  <span className="cart-badge">{cart.totalItems}</span>
                )}
              </Link>
              <div className="user-menu">
                <button className="user-btn" id="user-menu-btn">
                  <span className="user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/orders" className="dropdown-item">📦 My Orders</Link>
                  {isAdmin && <Link to="/admin" className="dropdown-item">⚙️ Admin Panel</Link>}
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item dropdown-item--danger" id="logout-btn">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} id="mobile-menu-btn">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu animate-fade">
          <Link to="/" className="mobile-link">🏠 Home</Link>
          <Link to="/menu" className="mobile-link">🍕 Menu</Link>
          {isLoggedIn && <Link to="/orders" className="mobile-link">📦 My Orders</Link>}
          {isLoggedIn && <Link to="/cart" className="mobile-link">🛒 Cart ({cart.totalItems})</Link>}
          {isAdmin && <Link to="/admin" className="mobile-link">⚙️ Admin</Link>}
          {isLoggedIn
            ? <button onClick={handleLogout} className="mobile-link mobile-link--danger">🚪 Logout</button>
            : <>
                <Link to="/login" className="mobile-link">Login</Link>
                <Link to="/register" className="mobile-link mobile-link--primary">Sign Up</Link>
              </>
          }
        </div>
      )}
    </nav>
  );
}
