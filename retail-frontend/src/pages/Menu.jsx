import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Menu.css';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const activeCat = searchParams.get('cat') ? Number(searchParams.get('cat')) : null;

  useEffect(() => {
    api.get('/products/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchFn = activeCat
      ? api.get(`/products/category/${activeCat}`)
      : search.trim()
        ? api.get(`/products?search=${encodeURIComponent(search)}`)
        : api.get('/products');
    fetchFn
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCat, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (activeCat) setSearchParams({});
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 40 }}>
        {/* Header */}
        <div className="menu-header">
          <div>
            <h1 className="section-title">Our Menu</h1>
            <p className="section-subtitle">Fresh, delicious, made with love</p>
          </div>
          <div className="menu-search">
            <span className="search-icon">🔍</span>
            <input
              id="menu-search-input"
              type="text"
              className="form-control"
              placeholder="Search pizza, drinks..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          <button
            className={`cat-filter-btn ${!activeCat ? 'active' : ''}`}
            onClick={() => { setSearchParams({}); setSearch(''); }}
            id="filter-all"
          >
            🍽️ All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-filter-btn ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => { setSearchParams({ cat: cat.id }); setSearch(''); }}
              id={`filter-cat-${cat.id}`}
            >
              {cat.name === 'Pizza' ? '🍕' : cat.name === 'Cold Drinks' ? '🥤' : '🍞'} {cat.name}
            </button>
          ))}
        </div>

        {/* Result count */}
        {!loading && (
          <p className="result-count">
            {products.length} item{products.length !== 1 ? 's' : ''}{activeCat ? ` in ${categories.find(c => c.id === activeCat)?.name}` : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3>No items found</h3>
            <p>Try a different search or category filter</p>
          </div>
        ) : (
          <div className="product-grid" style={{ marginTop: 24 }}>
            {products.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
