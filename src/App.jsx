// SURURO NEPAL CRAFTS - React Frontend
// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import AdminDashboard from './AdminDashboard';
import sururoLogo from './assets/sururo-removebg-preview.png';

// Vite uses VITE_ prefix, not REACT_APP_
const API_URL = import.meta.env.VITE_API_URL || '/api';

// ==================== NAVBAR ====================
const SHOP_MEGA_MENU = [
  {
    heading: 'BUDDHAS',
    items: ['Shakyamuni Buddha', 'Medicine Buddha', 'Blessing Buddha', 'Amitabha Buddha', 'Sleeping Buddha', 'Fasting Buddha'],
  },
  {
    heading: 'BUDDHIST GODS & DEITIES',
    items: ['Green Tara', 'White Tara', 'Guru Rinpoche', 'Guru Milarepa', 'Manjushri', 'Chenrezig', 'Maya Devi', 'Aparmita', 'Lokeshvara', 'Vajrasattva'],
  },
  {
    heading: 'HINDU GODS',
    items: ['Shiva', 'Nataraja Shiva', 'Ganesh', 'Naag Kanya'],
  },
  {
    heading: 'More',
    items: ['View All Statues', 'Wall Masks'],
  },
];

// ==================== SEARCH MODAL ====================
function SearchModal({ isOpen, onClose, products, onSearchSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      const results = products.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.description?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(results.slice(0, 6)); // Show top 6 results
      setShowResults(true);
    } else {
      setFilteredProducts([]);
      setShowResults(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="search-modal-form">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            autoFocus
            className="search-modal-input"
          />
          <button type="button" className="search-close-btn" onClick={onClose}>✕</button>
          <button type="submit" className="search-modal-submit">🔍</button>
        </form>

        {showResults && (
          <div className="search-dropdown">
            <div className="search-suggestions">
              <h4>SUGGESTIONS</h4>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery(product.name);
                      setShowResults(false);
                    }}
                  >
                    {product.name}
                  </div>
                ))
              ) : (
                <div className="no-results">No suggestions found</div>
              )}
              {searchQuery && (
                <div
                  className="search-all-link"
                  onClick={() => {
                    onSearchSubmit(searchQuery);
                    onClose();
                  }}
                >
                  Search for "{searchQuery}" →
                </div>
              )}
            </div>

            <div className="search-products">
              <h4>PRODUCTS</h4>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="search-product-item">
                    <img
                      src={product.image_url || `https://placehold.co/60x60/f8f4f0/8B1C1C`}
                      alt={product.name}
                    />
                    <span>{product.name}</span>
                  </div>
                ))
              ) : (
                <div className="no-results">No products found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Navbar({ cartCount, onCartClick, onOrdersClick, currentPage, onPageChange, products, onSearchSubmit }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <>
      <nav className="navbar" onMouseLeave={() => setShowMega(false)}>
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => onPageChange('home')} style={{ cursor: 'pointer' }}>
            <img src={sururoLogo} alt="Sururo Nepal Crafts" className="navbar-logo-img" />
          </div>

          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? '✕' : '☰'}
          </button>

          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => { onPageChange('home'); setIsMenuOpen(false); }}>Home</a></li>
            <li
              className="nav-shop-item"
              onMouseEnter={() => setShowMega(true)}
            >
              <a href="#products" onClick={() => setIsMenuOpen(false)}>Shop ▾</a>
              {showMega && (
                <div className="mega-menu">
                  {SHOP_MEGA_MENU.map(col => (
                    <div key={col.heading} className="mega-col">
                      <p className="mega-heading">{col.heading}</p>
                      {col.items.map(item => (
                        <a
                          key={item}
                          href="#products"
                          className="mega-item"
                          onClick={() => { setShowMega(false); setIsMenuOpen(false); }}
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
          </ul>

          <div className="navbar-right">
            <button 
              className="search-icon-btn" 
              onClick={() => setShowSearchModal(true)}
              aria-label="Search"
            >
              🔍
            </button>
            <button className="cart-btn" onClick={onCartClick} aria-label={`Cart, ${cartCount} items`}>
              🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="orders-btn" onClick={onOrdersClick} aria-label="My Orders">
              📦 My Orders
            </button>
          </div>
        </div>
      </nav>

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        products={products}
        onSearchSubmit={onSearchSubmit}
      />
    </>
  );
}

// ==================== HERO ====================
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="hero-eyebrow">Handmade in the Himalayas</p>
        <h2>Authentic Nepali Crafts for the World</h2>
        <p className="hero-sub">Each piece carries the hands and heritage of Nepali artisans</p>
        <a href="#products" className="cta-btn">Explore the Collection</a>
      </div>
      <div className="hero-badges">
        <span>✓ Deliveries in Nepal</span>
        <span>✓ 100% Handmade</span>
        <span>✓ Direct from Artisans</span>
      </div>
    </section>
  );
}

// ==================== CATEGORY FILTER ====================
const STATUES_SUBMENU = [
  { heading: 'BUDDHAS', items: ['Shakyamuni Buddha', 'Medicine Buddha', 'Blessing Buddha', 'Amitabha Buddha', 'Sleeping Buddha', 'Fasting Buddha'] },
  { heading: 'BUDDHIST GODS & DEITIES', items: ['Green Tara', 'White Tara', 'Guru Rinpoche', 'Manjushri', 'Chenrezig', 'Vajrasattva'] },
  { heading: 'HINDU GODS', items: ['Shiva', 'Nataraja Shiva', 'Ganesh', 'Naag Kanya'] },
  { heading: 'More', items: ['View All Statues', 'Wall Masks'] },
];

function CategoryFilter({ categories, selectedCategory, onCategoryChange, selectedSubcategory, onSubcategoryChange }) {
  const [showStatuesSub, setShowStatuesSub] = useState(false);

  return (
    <div className="category-filter">
      <h3>Categories</h3>
      <button
        className={selectedCategory === null ? 'active' : ''}
        onClick={() => { onCategoryChange(null); setShowStatuesSub(false); }}
      >
        All Products
      </button>
      {categories.map(cat => (
        <div key={cat.id} className="cat-item-wrap">
          <button
            className={selectedCategory === cat.id && !selectedSubcategory ? 'active' : ''}
            onClick={() => {
              onCategoryChange(cat.id);
              if (cat.name === 'Statues' || cat.name === 'Buddhist Statues') {
                setShowStatuesSub(!showStatuesSub);
              } else {
                setShowStatuesSub(false);
              }
            }}
          >
            {cat.name} {(cat.name === 'Statues' || cat.name === 'Buddhist Statues') ? (showStatuesSub ? '▲' : '▼') : ''}
          </button>
          {(cat.name === 'Statues' || cat.name === 'Buddhist Statues') && showStatuesSub && (
            <div className="statues-submenu">
              {STATUES_SUBMENU.map(col => (
                <div key={col.heading} className="statues-sub-col">
                  <p className="statues-sub-heading">{col.heading}</p>
                  {col.items.map(item => (
                    item === 'View All Statues'
                      ? <a key={item} href="#products" className="statues-sub-item"
                          onClick={() => { onSubcategoryChange(null); onCategoryChange(cat.id); }}
                        >{item}</a>
                      : <a
                          key={item}
                          href="#products"
                          className={`statues-sub-item${selectedSubcategory === item ? ' active' : ''}`}
                          onClick={() => { onCategoryChange(cat.id); onSubcategoryChange(item); }}
                        >{item}</a>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== PRODUCT CARD ====================
function ProductCard({ product, onAddToCart, onViewDetails }) {
  return (
    <div className="product-card">
      <div className="product-image" onClick={() => onViewDetails(product.id)}>
        <img
          src={product.image_url || `https://placehold.co/300x300/f8f4f0/8B1C1C?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/300x300/f8f4f0/8B1C1C?text=${encodeURIComponent(product.name)}`;
          }}
        />
        {product.stock_quantity === 0 && <div className="out-of-stock">Sold Out</div>}
        {product.handmade && <div className="handmade-tag">Handmade</div>}
      </div>
      <div className="product-info">
        <h3 onClick={() => onViewDetails(product.id)}>{product.name}</h3>

        <p className="description">{product.description?.substring(0, 75)}{product.description?.length > 75 ? '…' : ''}</p>

        <div className="product-meta">
          {product.rating_count > 0 && (
            <span className="rating">⭐ {Number(product.rating).toFixed(1)} <span className="rating-count">({product.rating_count})</span></span>
          )}
        </div>

        <div className="product-footer">
          <span className="price">Rs. {Number(product.price).toLocaleString('en-NP', {maximumFractionDigits: 0})}</span>
          <div className="product-actions">
            <button className="view-btn" onClick={() => onViewDetails(product.id)}>Details</button>
            <button
              className="add-btn"
              onClick={() => onAddToCart(product)}
              disabled={product.stock_quantity === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PRODUCTS GRID ====================
function ProductsGrid({ products, onAddToCart, onViewDetails, isLoading }) {
  if (isLoading) {
    return (
      <div className="loading-grid">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

// ==================== PRODUCT DETAILS MODAL ====================
function ProductDetails({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart({ ...product, quantity });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>

        <div className="product-details-grid">
          <div className="details-image">
            <img
              src={product.image_url || `https://placehold.co/500x500/f8f4f0/8B1C1C?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              onError={(e) => {
                e.target.src = `https://placehold.co/500x500/f8f4f0/8B1C1C?text=${encodeURIComponent(product.name)}`;
              }}
            />
          </div>

          <div className="details-info">
            <h2>{product.name}</h2>

            {product.rating_count > 0 && (
              <div className="rating-row">
                <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span className="rating-label">{Number(product.rating).toFixed(1)} / 5 ({product.rating_count} reviews)</span>
              </div>
            )}

            <div className="detail-description">
              {product.description?.split(/\.\s+/).filter(Boolean).map((sentence, i) => (
                <p key={i}>{sentence}{sentence.endsWith('.') ? '' : '.'}</p>
              ))}
            </div>

            <div className="specs-grid">
              {product.material && <div className="spec"><span className="spec-label">Material</span><span>{product.material}</span></div>}
              {product.size && <div className="spec"><span className="spec-label">Size</span><span>{product.size}</span></div>}
              {product.weight && <div className="spec"><span className="spec-label">Weight</span><span>{product.weight}</span></div>}

              {product.origin && <div className="spec"><span className="spec-label">Origin</span><span>{product.origin}</span></div>}
              {product.handmade && <div className="spec"><span className="spec-label">Made by hand</span><span className="handmade-yes">✓ Yes</span></div>}
            </div>

            <div className="price-block">
              <span className="detail-price">Rs. {(Number(product.price) * quantity).toLocaleString('en-NP', {maximumFractionDigits: 0})}</span>
            </div>

            <div className="qty-row">
              <label>Quantity</label>
              <div className="qty-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}>+</button>
              </div>
              <span className="stock-note">{product.stock_quantity} in stock</span>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={handleAdd}
              disabled={product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>

            {(product.reviews || []).length > 0 && (
              <div className="reviews-section">
                <h4>Customer Reviews</h4>
                {product.reviews.slice(0, 3).map(r => (
                  <div key={r.id} className="review">
                    <div className="review-header">
                      <strong>{r.customer_name}</strong>
                      <span className="review-stars">{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.title && <p className="review-title">{r.title}</p>}
                    <p>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SHOPPING CART ====================
function ShoppingCart({ cartItems, onClose, onCheckout, onUpdateCart }) {
  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  const handleQty = (id, delta) => {
    const updated = cartItems
      .map(item => item.id === id ? { ...item, quantity: (item.quantity || 1) + delta } : item)
      .filter(item => item.quantity > 0);
    onUpdateCart(updated);
  };

  const handleRemove = (id) => {
    onUpdateCart(cartItems.filter(item => item.id !== id));
  };

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cart-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button className="cta-btn-sm" onClick={onClose}>Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image_url || `https://placehold.co/80x80/f8f4f0/8B1C1C?text=Craft`}
                    alt={item.name}
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/f8f4f0/8B1C1C?text=Craft'; }}
                  />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Rs. {Number(item.price).toLocaleString('en-NP', {maximumFractionDigits: 0})} each</p>
                    <div className="item-qty">
                      <button onClick={() => handleQty(item.id, -1)}>−</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => handleQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-right">
                    <span className="item-total">Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString('en-NP', {maximumFractionDigits: 0})}</span>
                    <button className="remove-btn" onClick={() => handleRemove(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>Rs. {total.toLocaleString('en-NP', {maximumFractionDigits: 0})}</strong>
              </div>
              <p className="free-ship-note">✓ Deliveries in Nepal</p>
              <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== CHECKOUT ====================
function CheckoutForm({ cartItems, onClose, onOrderComplete }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('form');
  const [placedOrder, setPlacedOrder] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.customer_name.trim()) errs.customer_name = 'Full name is required.';
    if (!formData.customer_email.trim()) {
      errs.customer_email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      errs.customer_email = 'Enter a valid email address.';
    }
    if (!formData.customer_phone.trim()) {
      errs.customer_phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s\-]{7,15}$/.test(formData.customer_phone)) {
      errs.customer_phone = 'Enter a valid phone number.';
    }
    if (!formData.address.trim()) errs.address = 'Street address is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';

    if (!formData.country.trim()) errs.country = 'Country is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(validate()).length > 0) {
      setErrors(validate());
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          phone: formData.customer_phone,
          items: cartItems,
          total_amount: total,
          shipping_data: formData
        })
      });

      if (response.ok) {
        setStep('success');
        onOrderComplete();
      } else {
        setErrors({ submit: 'Failed to place order' });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content success-modal" onClick={e => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h2>Thank you for your order!</h2>
          <p>We will contact you shortly.</p>
          <button className="checkout-btn" onClick={onClose}>Back to Shop</button>
        </div>
      </div>
    );
  }

  const whatsappNumber = '9779713490157';
  const whatsappMessage = encodeURIComponent(
    `Hello Sururo! I'd like to place an order.\n\nName: ${formData.customer_name}\nEmail: ${formData.customer_email}\nPhone: ${formData.customer_phone}\n\nItems:\n${cartItems.map(i => `- ${i.name} ×${i.quantity || 1} — Rs. ${(Number(i.price) * (i.quantity || 1)).toLocaleString()}`).join('\n')}\n\nTotal: Rs. ${total.toLocaleString()}\n\nShipping to: ${formData.address}, ${formData.city}, ${formData.postal_code}, ${formData.country}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Checkout</h2>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form" noValidate>
            <h3>Shipping Details</h3>

            <div className="form-row">
              <div className="field-wrap">
                <input name="customer_name" placeholder="Full Name *" value={formData.customer_name} onChange={handleChange} />
                {errors.customer_name && <span className="field-error">{errors.customer_name}</span>}
              </div>
              <div className="field-wrap">
                <input name="customer_email" type="email" placeholder="Email Address *" value={formData.customer_email} onChange={handleChange} />
                {errors.customer_email && <span className="field-error">{errors.customer_email}</span>}
              </div>
            </div>

            <div className="field-wrap">
              <div className="phone-input-wrap">
                <span className="phone-prefix">+977</span>
                <input
                  name="customer_phone"
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  style={{ borderRadius: '0 var(--radius) var(--radius) 0', borderLeft: 'none' }}
                />
              </div>
              {errors.customer_phone && <span className="field-error">{errors.customer_phone}</span>}
            </div>

            <div className="field-wrap">
              <textarea name="address" placeholder="Street Address *" value={formData.address} onChange={handleChange} rows={2} />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="field-wrap">
                <input name="city" placeholder="City *" value={formData.city} onChange={handleChange} />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className="field-wrap">
                <input name="postal_code" placeholder="Postal Code *" value={formData.postal_code} onChange={handleChange} />
                {errors.postal_code && <span className="field-error">{errors.postal_code}</span>}
              </div>
            </div>

            <div className="field-wrap">
              <input name="country" placeholder="Country *" value={formData.country} onChange={handleChange} />
              {errors.country && <span className="field-error">{errors.country}</span>}
            </div>

            <h3>Payment</h3>
            <div className="whatsapp-payment-box">
              <div className="whatsapp-payment-icon">💬</div>
              <div className="whatsapp-payment-info">
                <strong>Contact us on WhatsApp</strong>
                <p>+977 971-3490157</p>
                <p className="whatsapp-note">Message us for pricing details & payment confirmation after placing your order.</p>
              </div>
            </div>

            <button type="submit" className="checkout-btn" disabled={isLoading}>
              {isLoading ? 'Placing order…' : `Place Order · Rs. ${total.toLocaleString('en-NP', {maximumFractionDigits: 0})}`}
            </button>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-direct-btn">
              💬 Message on WhatsApp directly
            </a>
          </form>

          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} ×{item.quantity || 1}</span>
                <span>Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString('en-NP', {maximumFractionDigits: 0})}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-total-row">
              <strong>Total</strong>
              <div>
                <strong>Rs. {total.toLocaleString('en-NP', {maximumFractionDigits: 0})} + Delivery Charge</strong>
                <p style={{fontSize: '11px', color: '#999', margin: '5px 0 0 0'}}>(Delivery charge is not included here)</p>
              </div>
            </div>
            <p className="summary-ship">✓ Deliveries in Nepal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ABOUT ====================
function About() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <p className="section-eyebrow">Our Story</p>
            <h2>Crafted with Himalayan Soul</h2>
            <p>Sururo connects you directly with master artisans from Lalitpur, Kathmandu Valley, Bhaktapur, and the mountain communities of Nepal. Every item leaves a workshop, not a factory.</p>
            <p>We handle shipping, customs, and quality checks — so you receive each piece the way it was made: with care.</p>
          </div>
          <div className="about-stats">
            <div className="stat"><strong>200+</strong><span>Artisan Families</span></div>
            <div className="stat"><strong>5000+</strong><span>Orders Delivered</span></div>
            <div className="stat"><strong>100%</strong><span>Handmade</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== CONTACT ====================
function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const message = formData.get('message');

      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject: 'Contact Form', message })
      });

      if (response.ok) {
        setSent(true);
        e.target.reset();
        setTimeout(() => setSent(false), 4000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Error sending message: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <p className="section-eyebrow">Contact</p>
        <h2>Get in Touch</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-item"><strong>📍 Address</strong><p><a href="https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=Lalitpur&FORM=FBKPL1&mkt=en-US" target="_blank" rel="noopener noreferrer">Lalitpur, Nepal</a></p></div>
            <div className="info-item"><strong>📞 Phone</strong><p><a href="tel:+9779713490157">+977 971-3490157</a></p></div>
            <div className="info-item"><strong>📱 Follow Us</strong>
              <p>
                <a href="https://www.instagram.com/sururo.np/" target="_blank" rel="noopener noreferrer">Instagram</a>
                &nbsp;·&nbsp;
                <a href="https://www.facebook.com/profile.php?id=61586503658759" target="_blank" rel="noopener noreferrer">Facebook</a>
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="contact-form">
            {sent && <div className="sent-msg">✓ Thank you for your feedback</div>}
            {error && <div className="error-msg" style={{background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '5px', marginBottom: '15px'}}>{error}</div>}
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Email Address" required />
            <input type="tel" name="phone" placeholder="Mobile Number" required />
            <textarea name="message" placeholder="Your message…" rows={5} required />
            <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ==================== FOOTER ====================
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h4>SURURO</h4>
          <p>Nepal Crafts</p>
          <p className="footer-tagline">Handmade with ❤️ from the Himalayas</p>
        </div>
        <div className="footer-links">
          <h5>Shop</h5>
          <a href="#products">All Products</a>
          <a href="#products">Statues</a>
          <a href="#products">Decor</a>
          <a href="#products">Paintings</a>
          <a href="#products">Gifts</a>
        </div>
        <div className="footer-links">
          <h5>Company</h5>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div className="footer-links">
          <h5>Follow</h5>
          <a href="https://www.facebook.com/profile.php?id=61586503658759" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.instagram.com/sururo.np/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Sururo Nepal Crafts. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ==================== TOAST ====================
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return <div className="toast">{message}</div>;
}

// ==================== MAIN APP ====================
// ==================== PRICE RANGE FILTER ====================
function PriceRangeFilter({ priceFilter, setPriceFilter }) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const applyRange = () => {
    const f = Number(from);
    const t = Number(to);
    if (!from && !to) { setPriceFilter('all'); setOpen(false); return; }
    if (from && !to) { setPriceFilter(`custom:${f}:`); }
    else if (!from && to) { setPriceFilter(`custom::${t}`); }
    else { setPriceFilter(`custom:${f}:${t}`); }
    setOpen(false);
  };

  const clearRange = () => {
    setFrom(''); setTo('');
    setPriceFilter('all');
    setOpen(false);
  };

  const label = priceFilter === 'all' ? 'Price' :
    priceFilter.startsWith('custom:') ? (() => {
      const [, f, t] = priceFilter.split(':');
      if (f && t) return `$${f} – $${t}`;
      if (f) return `From $${f}`;
      return `Up to $${t}`;
    })() : 'Price';

  return (
    <div className="price-range-wrap">
      <button
        className={`filter-btn${priceFilter !== 'all' ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        {label}
      </button>
      {open && (
        <div className="price-range-panel">
          <div className="price-range-inputs">
            <div className="price-range-field">
              <span className="price-range-symbol">$</span>
              <input
                type="number"
                min="0"
                placeholder="From"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="price-range-input"
              />
            </div>
            <div className="price-range-field">
              <span className="price-range-symbol">$</span>
              <input
                type="number"
                min="0"
                placeholder="To"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="price-range-input"
              />
            </div>
          </div>
          <div className="price-range-actions">
            <button className="price-range-clear" onClick={clearRange} type="button">Clear</button>
            <button className="price-range-apply" onClick={applyRange} type="button">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SEARCH RESULTS FORM ====================
function SearchResultsForm({ searchQuery, onSearch }) {
  const inputRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputRef.current.value);
  };

  const handleClear = () => {
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  return (
    <form className="search-results-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search"
        defaultValue={searchQuery}
        className="search-results-input"
      />
      <button type="button" className="search-clear-btn" onClick={handleClear}>✕</button>
      <button type="submit" className="search-results-submit">🔍</button>
    </form>
  );
}

// ==================== MY ORDERS ====================
function MyOrdersModal({ onClose, apiUrl }) {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/orders/by-email?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setSearched(true);
      } else {
        setError('Could not fetch orders. Try again.');
      }
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content my-orders-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '95%' }}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 style={{ marginBottom: '20px' }}>📦 My Orders</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{ background: '#8B1C1C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

        {searched && orders.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: '30px 0' }}>No orders found for this email.</p>
        )}

        {orders.map(order => (
          <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>{order.customer_name}</strong>
              <span style={{ background: order.status === 'completed' ? '#27ae60' : '#e67e22', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>
                {order.status || 'pending'}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '6px' }}>📅 {new Date(order.created_at).toLocaleDateString()}</p>
            <p style={{ fontWeight: '600', color: '#8B1C1C' }}>Total: Rs. {Number(order.total_amount).toLocaleString()}</p>
            {Array.isArray(order.items) && order.items.length > 0 && (
              <ul style={{ marginTop: '8px', paddingLeft: '16px', fontSize: '13px', color: '#555' }}>
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} ×{item.quantity || 1} — Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString()}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(
    window.location.hash === '#admin' ? 'admin' : 'home'
  );
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sururo_cart') || '[]'); } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceFilter, setPriceFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('sururo_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) setCategories(await res.json());
    } catch {}
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}/products`;
      const params = [];
      if (selectedCategory) params.push(`category_id=${selectedCategory}`);
      if (selectedSubcategory) params.push(`subcategory=${encodeURIComponent(selectedSubcategory)}`);
      if (params.length) url += '?' + params.join('&');
      const res = await fetch(url);
      if (res.ok) setProducts(await res.json());
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id
          ? { ...i, quantity: (i.quantity || 1) + (product.quantity || 1) }
          : i
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    setToast(`"${product.name}" added to cart`);
  };

  const handleViewDetails = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`);
      if (res.ok) setSelectedProduct(await res.json());
    } catch {}
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    const results = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage('search');
    setSortBy('relevance');
    setPriceFilter('all');
    setAvailabilityFilter('all');
  };

  const getSortedResults = () => {
    let filtered = [...searchResults];

    // Apply availability filter
    if (availabilityFilter === 'in-stock') {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    } else if (availabilityFilter === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock_quantity === 0);
    }

    // Apply price filter
    if (priceFilter.startsWith('custom:')) {
      const [, f, t] = priceFilter.split(':');
      const from = f ? Number(f) : null;
      const to = t ? Number(t) : null;
      filtered = filtered.filter(p => {
        const price = Number(p.price);
        if (from !== null && to !== null) return price >= from && price <= to;
        if (from !== null) return price >= from;
        if (to !== null) return price <= to;
        return true;
      });
    }

    // Apply sorting
    if (sortBy === 'relevance') {
      return filtered;
    } else if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'newest') {
      return [...filtered].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'rating') {
      return [...filtered].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return filtered;
  };

  const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);

  if (currentPage === 'admin') {
    return <AdminDashboard onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'search') {
    return (
      <div className="App">
        <Navbar
          cartCount={cartCount}
          onCartClick={() => setShowCart(true)}
          onOrdersClick={() => setShowMyOrders(true)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          products={products}
          onSearchSubmit={handleSearchSubmit}
        />

        <section className="search-results-section">
          <div className="container">
            <h1>Search results</h1>
            <SearchResultsForm searchQuery={searchQuery} onSearch={handleSearchSubmit} />

            <div className="search-results-filters">
              <div className="filter-group">
                <span>Filter:</span>
                <select 
                  className="filter-btn" 
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="all">Availability</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
                <PriceRangeFilter priceFilter={priceFilter} setPriceFilter={setPriceFilter} />
              </div>
              <div className="search-results-info">
                <div>
                  <span>Sort by: </span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <span>{getSortedResults().length} results</span>
              </div>
            </div>

            <div className="search-results-grid">
              {getSortedResults().length > 0 ? (
                getSortedResults().map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="no-search-results">
                  <p>No products found matching your filters</p>
                  <button onClick={() => setCurrentPage('home')} className="back-home-btn">
                    Back to Home
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />

        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}

        {showCart && (
          <ShoppingCart
            cartItems={cartItems}
            onClose={() => setShowCart(false)}
            onUpdateCart={setCartItems}
            onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
          />
        )}

        {showCheckout && (
          <CheckoutForm
            cartItems={cartItems}
            onClose={() => setShowCheckout(false)}
            onOrderComplete={() => setCartItems([])}
          />
        )}

        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      {showMyOrders && (
        <MyOrdersModal onClose={() => setShowMyOrders(false)} apiUrl={API_URL} />
      )}
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
          onOrdersClick={() => setShowMyOrders(true)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        products={products}
        onSearchSubmit={handleSearchSubmit}
      />

      <Hero />

      <section id="products" className="products-section">
        <div className="container">
          <p className="section-eyebrow">Our Collections</p>
          <h2>Handpicked from Nepal</h2>
          <div className="products-layout">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(catId) => { setSelectedCategory(catId); setSelectedSubcategory(null); }}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryChange={setSelectedSubcategory}
            />
            <ProductsGrid
              products={products}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      <About />
      <Contact />
      <Footer />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {showCart && (
        <ShoppingCart
          cartItems={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateCart={setCartItems}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {showCheckout && (
        <CheckoutForm
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={() => setCartItems([])}
        />
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      {showMyOrders && (
        <MyOrdersModal onClose={() => setShowMyOrders(false)} apiUrl={API_URL} />
      )}

      {/* Hidden admin link – navigate to /#admin */}
    </div>
  );
}

export default App;