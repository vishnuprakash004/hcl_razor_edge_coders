import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Products',   value: stats.totalProducts,   icon: '🍕', color: 'var(--primary)' },
    { label: 'Total Orders',     value: stats.totalOrders,     icon: '📦', color: 'var(--info)' },
    { label: 'Total Users',      value: stats.totalUsers,      icon: '👥', color: 'var(--success)' },
    { label: 'Pending Orders',   value: stats.pendingOrders,   icon: '⏳', color: 'var(--warning)' },
    { label: 'Delivered Orders', value: stats.deliveredOrders, icon: '✅', color: 'var(--success)' },
    { label: 'Low Stock Items',  value: stats.lowStockProducts,icon: '⚠️', color: 'var(--danger)' },
  ] : [];

  const navLinks = [
    { to: '/admin/products',  icon: '🍕', label: 'Manage Products',   desc: 'Add, edit, delete products' },
    { to: '/admin/orders',    icon: '📦', label: 'Manage Orders',     desc: 'View & update order status' },
    { to: '/admin/inventory', icon: '📊', label: 'Inventory',         desc: 'Update stock quantities' },
    { to: '/admin/coupons',   icon: '🏷️', label: 'Coupons',          desc: 'Create & manage promotions' },
  ];

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="section-subtitle">FoodieHub management portal</p>
          </div>
          <Link to="/" className="btn btn-ghost btn-sm">← Back to Store</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="stat-card__icon" style={{ background: `${s.color}22` }}>{s.icon}</div>
              <div>
                <p className="stat-card__label">{s.label}</p>
                <p className="stat-card__value" style={{ color: s.color }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Nav */}
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-nav-grid">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.to} className="admin-nav-card" id={`admin-nav-${link.label.replace(/\s+/g, '-').toLowerCase()}`}>
              <div className="admin-nav-card__icon">{link.icon}</div>
              <div>
                <h3>{link.label}</h3>
                <p>{link.desc}</p>
              </div>
              <span className="admin-nav-card__arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
