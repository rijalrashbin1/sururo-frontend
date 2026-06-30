// SURURO NEPAL CRAFTS – Admin Dashboard
// src/AdminDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const EMPTY_FORM = {
  name: '', description: '', category_id: '',
  price: '', stock_quantity: '',
  image_url: '', material: '', size: '',
  weight: '', artisan_name: '', origin: ''
};

function AdminDashboard({ onBack }) {
  const [token, setToken] = useState(() => localStorage.getItem('sururo_admin_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('sururo_admin_token'));
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/categories`)
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoadingData(false);
    }
  }, [token]);

  useEffect(() => { if (isLoggedIn) loadData(); }, [isLoggedIn, loadData]);

  // Escape key closes form
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') resetForm(); };
    if (showForm) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showForm]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('sururo_admin_token', data.token);
        setIsLoggedIn(true);
      } else {
        showToast('Invalid email or password', 'error');
      }
    } catch {
      showToast('Connection error. Is the backend running?', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('sururo_admin_token');
    setIsLoggedIn(false);
    setProducts([]);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const url = editingProduct
      ? `${API_URL}/admin/products/${editingProduct.id}`
      : `${API_URL}/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity)
        })
      });
      if (res.ok) {
        showToast(editingProduct ? 'Product updated' : 'Product created');
        resetForm();
        loadData();
      } else {
        showToast('Save failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category_id: product.category_id || '',
      price: product.price?.toString() || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      image_url: product.image_url || '',
      material: product.material || '',
      size: product.size || '',
      weight: product.weight || '',
      artisan_name: product.artisan_name || '',
      origin: product.origin || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { showToast('Product deleted'); loadData(); }
      else showToast('Delete failed', 'error');
    } catch {
      showToast('Network error', 'error');
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingProduct(null);
    setShowForm(false);
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || id;

  const filteredProducts = products.filter(p =>
    !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==================== LOGIN PAGE ====================
  if (!isLoggedIn) {
    return (
      <div style={s.page}>
        <style>{adminCSS}</style>
        {toast && <div className={`ad-toast ${toast.type}`}>{toast.msg}</div>}
        <div className="ad-login-wrap">
          <div className="ad-login-logo">
            <h1>SURURO</h1>
            <p>Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="ad-login-form">
            <h2>Sign in</h2>
            <div className="ad-field">
              <label>Email</label>
              <input
                type="email" value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                placeholder="admin@sururo.com" required autoFocus
              />
            </div>
            <div className="ad-field">
              <label>Password</label>
              <input
                type="password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••" required
              />
            </div>
            <button type="submit" className="ad-btn-primary" disabled={isSaving}>
              {isSaving ? 'Signing in…' : 'Sign In'}
            </button>
            {onBack && (
              <button type="button" onClick={onBack} className="ad-btn-ghost">
                ← Back to Store
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock_quantity <= 5).length;
  const totalValue = products.reduce((s, p) => s + Number(p.price) * p.stock_quantity, 0);

  return (
    <div style={s.page}>
      <style>{adminCSS}</style>
      {toast && <div className={`ad-toast ${toast.type}`}>{toast.msg}</div>}

      {/* SIDEBAR */}
      <div className="ad-sidebar">
        <div className="ad-sidebar-logo">
          <span>SURURO</span>
          <small>Admin</small>
        </div>
        <nav className="ad-nav">
          <button className={`ad-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            📦 Products
          </button>
          <button className={`ad-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            🧾 Orders
          </button>
          <button className={`ad-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            ⚙️ Settings
          </button>
        </nav>
        <div className="ad-sidebar-footer">
          {onBack && <button className="ad-btn-ghost-sm" onClick={onBack}>← Store</button>}
          <button className="ad-btn-ghost-sm" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="ad-main">
        {/* HEADER */}
        <div className="ad-topbar">
          <h1>Products</h1>
          <button className="ad-btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            + Add Product
          </button>
        </div>

        {/* STATS */}
        <div className="ad-stats">
          <div className="ad-stat-card">
            <span className="ad-stat-num">{totalProducts}</span>
            <span className="ad-stat-label">Total Products</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-num warn">{lowStock}</span>
            <span className="ad-stat-label">Low Stock (≤5)</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-num">{categories.length}</span>
            <span className="ad-stat-label">Categories</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-num">Rs. {(totalValue * 135).toLocaleString('en-NP', { maximumFractionDigits: 0 })}</span>
            <span className="ad-stat-label">Inventory Value</span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="ad-toolbar">
          <input
            className="ad-search"
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="ad-btn-outline" onClick={loadData}>↻ Refresh</button>
        </div>

        {/* TABLE */}
        <div className="ad-table-wrap">
          {isLoadingData ? (
            <div className="ad-loading">Loading products…</div>
          ) : filteredProducts.length === 0 ? (
            <div className="ad-empty">
              {searchQuery ? `No products match "${searchQuery}"` : 'No products yet. Add your first one!'}
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="ad-product-cell">
                        <img
                          src={p.image_url || `https://placehold.co/48x48/f8f4f0/8B1C1C?text=${encodeURIComponent(p.name?.[0] || '?')}`}
                          alt={p.name}
                          className="ad-product-img"
                          onError={e => { e.target.src = 'https://placehold.co/48x48/f8f4f0/8B1C1C?text=?'; }}
                        />
                        <div>
                          <div className="ad-product-name">{p.name}</div>
                          {p.artisan_name && <div className="ad-product-sub">by {p.artisan_name}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className="ad-badge">{getCategoryName(p.category_id)}</span></td>
                    <td><strong>Rs. {(Number(p.price) * 135).toLocaleString('en-NP', { maximumFractionDigits: 0 })}</strong></td>
                    <td>
                      <span className={`ad-stock ${p.stock_quantity <= 5 ? 'warn' : ''}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td>
                      {p.rating_count > 0
                        ? `⭐ ${Number(p.rating).toFixed(1)} (${p.rating_count})`
                        : <span style={{ color: '#aaa' }}>—</span>}
                    </td>
                    <td>
                      <div className="ad-actions-cell">
                        <button className="ad-btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="ad-btn-delete" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PRODUCT FORM MODAL */}
      {showForm && (
        <div className="ad-modal-overlay" onClick={resetForm}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button className="ad-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="ad-form">
              <div className="ad-field">
                <label>Product Name *</label>
                <input name="name" value={formData.name} onChange={handleFormChange} required autoFocus />
              </div>

              <div className="ad-field">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} rows={3} />
              </div>

              <div className="ad-form-row">
                <div className="ad-field">
                  <label>Category *</label>
                  <select name="category_id" value={formData.category_id} onChange={handleFormChange} required>
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ad-field">
                  <label>Price (NPR) *</label>
                  <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="ad-form-row">
                <div className="ad-field">
                  <label>Stock Quantity *</label>
                  <input name="stock_quantity" type="number" min="0" value={formData.stock_quantity} onChange={handleFormChange} required />
                </div>
                <div className="ad-field">
                  <label>Image URL</label>
                  <input name="image_url" type="url" placeholder="https://…" value={formData.image_url} onChange={handleFormChange} />
                </div>
              </div>

              <div className="ad-form-row">
                <div className="ad-field">
                  <label>Material</label>
                  <input name="material" placeholder="e.g. Brass, Stone" value={formData.material} onChange={handleFormChange} />
                </div>
                <div className="ad-field">
                  <label>Size</label>
                  <input name="size" placeholder="e.g. 12 inches" value={formData.size} onChange={handleFormChange} />
                </div>
              </div>

              <div className="ad-form-row">
                <div className="ad-field">
                  <label>Weight</label>
                  <input name="weight" placeholder="e.g. 2.5 kg" value={formData.weight} onChange={handleFormChange} />
                </div>
                <div className="ad-field">
                  <label>Artisan Name</label>
                  <input name="artisan_name" value={formData.artisan_name} onChange={handleFormChange} />
                </div>
              </div>

              <div className="ad-field">
                <label>Origin</label>
                <input name="origin" placeholder="e.g. Bhaktapur, Nepal" value={formData.origin} onChange={handleFormChange} />
              </div>

              <div className="ad-form-actions">
                <button type="button" className="ad-btn-ghost" onClick={resetForm}>Cancel</button>
                <button type="submit" className="ad-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving…' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh', background: '#F5F4F2', fontFamily: "'Inter', sans-serif" }
};

const adminCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .ad-sidebar {
    width: 220px; min-height: 100vh; background: #1A1A1A; flex-shrink: 0;
    display: flex; flex-direction: column; padding: 0;
    position: sticky; top: 0; height: 100vh;
  }
  .ad-sidebar-logo {
    padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .ad-sidebar-logo span {
    display: block; font-size: 18px; font-weight: 700; letter-spacing: 3px;
    color: white;
  }
  .ad-sidebar-logo small {
    font-size: 10px; color: #C9A84C; letter-spacing: 2px; text-transform: uppercase;
  }
  .ad-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
  .ad-nav-item {
    width: 100%; background: none; border: none; text-align: left;
    padding: 10px 14px; border-radius: 6px; color: rgba(255,255,255,0.55);
    font-size: 14px; font-weight: 500; cursor: pointer;
    transition: all 0.15s; font-family: 'Inter', sans-serif;
  }
  .ad-nav-item:hover { background: rgba(255,255,255,0.06); color: white; }
  .ad-nav-item.active { background: #8B1C1C; color: white; }
  .ad-sidebar-footer {
    padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; flex-direction: column; gap: 4px;
  }
  .ad-btn-ghost-sm {
    width: 100%; background: none; border: none; text-align: left;
    padding: 8px 14px; border-radius: 6px; color: rgba(255,255,255,0.4);
    font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; transition: color 0.15s;
  }
  .ad-btn-ghost-sm:hover { color: white; }

  .ad-main { flex: 1; overflow-y: auto; padding: 32px 36px; max-width: 1100px; }

  .ad-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .ad-topbar h1 { font-size: 24px; font-weight: 700; color: #1A1A1A; }

  .ad-btn-primary {
    background: #8B1C1C; color: white; border: none;
    padding: 10px 22px; border-radius: 6px; font-weight: 600; font-size: 14px;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .ad-btn-primary:hover:not(:disabled) { background: #A62C2C; }
  .ad-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .ad-btn-outline {
    background: white; color: #3D4451; border: 1px solid #D8D0C8;
    padding: 9px 18px; border-radius: 6px; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: border-color 0.15s;
  }
  .ad-btn-outline:hover { border-color: #8B1C1C; color: #8B1C1C; }

  .ad-btn-ghost {
    background: none; color: #3D4451; border: 1px solid #D8D0C8;
    padding: 9px 18px; border-radius: 6px; font-size: 14px;
    cursor: pointer; font-family: 'Inter', sans-serif;
  }
  .ad-btn-ghost:hover { border-color: #3D4451; }

  .ad-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .ad-stat-card {
    background: white; border-radius: 10px; padding: 20px 22px;
    border: 1px solid #E8E4DF;
  }
  .ad-stat-num { display: block; font-size: 28px; font-weight: 700; color: #8B1C1C; margin-bottom: 4px; }
  .ad-stat-num.warn { color: #D97706; }
  .ad-stat-label { font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }

  .ad-toolbar { display: flex; gap: 12px; margin-bottom: 16px; align-items: center; }
  .ad-search {
    flex: 1; padding: 10px 16px; border: 1px solid #D8D0C8; border-radius: 6px;
    font-family: 'Inter', sans-serif; font-size: 14px;
  }
  .ad-search:focus { outline: none; border-color: #8B1C1C; }

  .ad-table-wrap { background: white; border-radius: 10px; border: 1px solid #E8E4DF; overflow: hidden; }
  .ad-table { width: 100%; border-collapse: collapse; }
  .ad-table th {
    background: #8B1C1C; color: white; padding: 13px 16px;
    text-align: left; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .ad-table td { padding: 14px 16px; border-bottom: 1px solid #F0EDE9; font-size: 14px; vertical-align: middle; }
  .ad-table tr:last-child td { border-bottom: none; }
  .ad-table tr:hover td { background: #FDFCFB; }

  .ad-product-cell { display: flex; align-items: center; gap: 12px; }
  .ad-product-img { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; background: #F0EDE9; flex-shrink: 0; }
  .ad-product-name { font-weight: 600; color: #1A1A1A; }
  .ad-product-sub { font-size: 12px; color: #6B7280; margin-top: 2px; }

  .ad-badge {
    background: #F0EDE9; color: #6B4C1C; font-size: 12px; padding: 3px 10px;
    border-radius: 12px; font-weight: 500;
  }
  .ad-stock { font-weight: 600; color: #2D7A56; }
  .ad-stock.warn { color: #D97706; }

  .ad-actions-cell { display: flex; gap: 8px; }
  .ad-btn-edit {
    background: #FEF3C7; color: #92400E; border: none;
    padding: 6px 14px; border-radius: 5px; font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .ad-btn-edit:hover { background: #FDE68A; }
  .ad-btn-delete {
    background: #FEE2E2; color: #991B1B; border: none;
    padding: 6px 14px; border-radius: 5px; font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .ad-btn-delete:hover { background: #FECACA; }

  .ad-loading, .ad-empty { padding: 48px; text-align: center; color: #6B7280; }

  /* MODAL */
  .ad-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 20px;
  }
  .ad-modal {
    background: white; border-radius: 12px; width: 100%; max-width: 600px;
    max-height: 88vh; overflow-y: auto; padding: 28px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .ad-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .ad-modal-header h2 { font-size: 20px; font-weight: 700; color: #1A1A1A; }
  .ad-close {
    background: #F5F4F2; border: none; width: 32px; height: 32px;
    border-radius: 50%; cursor: pointer; font-size: 15px; color: #6B7280;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .ad-close:hover { background: #8B1C1C; color: white; }

  .ad-form { display: flex; flex-direction: column; gap: 14px; }
  .ad-field { display: flex; flex-direction: column; gap: 5px; }
  .ad-field label { font-size: 12px; font-weight: 600; color: #3D4451; text-transform: uppercase; letter-spacing: 0.5px; }
  .ad-field input,
  .ad-field select,
  .ad-field textarea {
    padding: 10px 14px; border: 1px solid #D8D0C8; border-radius: 6px;
    font-family: 'Inter', sans-serif; font-size: 14px; color: #1A1A1A;
    transition: border-color 0.15s;
  }
  .ad-field input:focus,
  .ad-field select:focus,
  .ad-field textarea:focus { outline: none; border-color: #8B1C1C; }
  .ad-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ad-form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }

  /* LOGIN */
  .ad-login-wrap {
    width: 380px; margin: auto; padding: 40px 24px;
  }
  .ad-login-logo { text-align: center; margin-bottom: 32px; }
  .ad-login-logo h1 { font-size: 28px; font-weight: 700; letter-spacing: 3px; color: #8B1C1C; }
  .ad-login-logo p { font-size: 12px; color: #6B7280; letter-spacing: 2px; text-transform: uppercase; }
  .ad-login-form {
    background: white; padding: 32px; border-radius: 12px;
    border: 1px solid #E8E4DF; box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .ad-login-form h2 { font-size: 20px; margin-bottom: 22px; color: #1A1A1A; }
  .ad-login-form .ad-field { margin-bottom: 16px; }
  .ad-login-form .ad-btn-primary,
  .ad-login-form .ad-btn-ghost { width: 100%; padding: 12px; margin-top: 4px; }

  /* TOAST */
  .ad-toast {
    position: fixed; top: 20px; right: 20px;
    padding: 12px 20px; border-radius: 8px; z-index: 9999;
    font-size: 14px; font-weight: 500; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    animation: slideIn 0.25s ease;
  }
  .ad-toast.success { background: #2D7A56; color: white; }
  .ad-toast.error { background: #991B1B; color: white; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

  @media (max-width: 900px) {
    .ad-stats { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .ad-sidebar { display: none; }
    .ad-main { padding: 20px; }
    .ad-form-row { grid-template-columns: 1fr; }
    .ad-stats { grid-template-columns: 1fr 1fr; }
  }
`;

export default AdminDashboard;
