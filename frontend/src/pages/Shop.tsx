import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft, X } from 'lucide-react';
import './Shop.css';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string;
  fullDescription: string;
  category: string;
  image: string;
  availability: 'in_stock' | 'made_to_order';
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Trailer Jig – Chartreuse Craw 3-Pack",
    price: 39.99,
    originalPrice: null,
    description: "Three of our chartreuse-and-olive Trailer Jigs, built on the world's first changeable jig hooks.",
    fullDescription: "Our signature Trailer Jigs feature hand-tied construction with lead-free materials and changeable jig hooks. Each 3-pack gives you versatile color options in our most productive chartreuse-and-olive combination. Perfect for freshwater bass, pike, and walleye.",
    category: "jigs",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "in_stock"
  },
  {
    id: 2,
    name: "Trailer Jig – Chartreuse Craw 2/0",
    price: 14.99,
    originalPrice: null,
    description: "Single hand-tied Trailer Jig in chartreuse craw on a size 2/0 changeable jig hook.",
    fullDescription: "A single premium Trailer Jig with our revolutionary changeable jig hook technology. Lead-free construction with hand-tied hair and proven chartreuse coloring.",
    category: "jigs",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "in_stock"
  },
  {
    id: 3,
    name: "Bucktail Jig – Blue Chartreuse 3-Pack",
    price: 44.99,
    originalPrice: null,
    description: "Three blue-and-chartreuse bucktail jigs with interchangeable painted heads.",
    fullDescription: "Our Bucktail Jigs combine premium bucktail hair with custom-painted heads on changeable hooks. Hand-tied for durability and proven fish appeal.",
    category: "jigs",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "in_stock"
  },
  {
    id: 4,
    name: "Bucktail Jig – Blue Chartreuse 2/0",
    price: 16.99,
    originalPrice: null,
    description: "Single blue-and-chartreuse bucktail on a size 2/0 changeable jig hook.",
    fullDescription: "Premium single Bucktail Jig featuring authentic bucktail hair and custom-painted head. Lead-free design with superior action.",
    category: "jigs",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "in_stock"
  },
  {
    id: 5,
    name: "Angler's Bundle – 6 Jig Variety Pack",
    price: 79.99,
    originalPrice: 99.99,
    description: "Six handcrafted, lead-free PIVIT jigs in our most productive patterns. Perfect starter pack.",
    fullDescription: "The Angler's Bundle is our most popular value package—six hand-tied jigs in six different colors and styles. All lead-free and designed for multiple freshwater species.",
    category: "bundles",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "in_stock"
  },
  {
    id: 6,
    name: "Big Water Bundle – 12 Hair Jig Variety Pack",
    price: 139.99,
    originalPrice: 179.99,
    description: "Twelve hand-tied PIVIT hair jigs in our most productive color patterns for big water.",
    fullDescription: "The Big Water Bundle brings together 12 premium hand-tied hair jigs in proven colors for pike, musky, and large bass. Save $40 compared to individual purchases.",
    category: "bundles",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "in_stock"
  },
  {
    id: 7,
    name: "Bulk Pro Case – 100+ Jig Wholesale Box",
    price: 569.00,
    originalPrice: null,
    description: "Professional wholesale option with 100+ hand-tied PIVIT jigs across all our most productive patterns.",
    fullDescription: "Perfect for retail shops, charter guides, and serious tournament anglers. Changeable hook system reduces inventory complexity. Call for volume pricing and custom color options.",
    category: "wholesale",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "made_to_order"
  },
  {
    id: 8,
    name: "Boot Camp Bundle – 10 Jig Variety Pack",
    price: 119.99,
    originalPrice: 149.99,
    description: "Ten hand-tied, lead-free PIVIT jigs in our best-selling color combos. Perfect for a week-long trip.",
    fullDescription: "Loaded with ten premium hand-tied jigs in purples, chartreuse, blues, and earth tones. All changeable hook system. Save $30 compared to individual purchases.",
    category: "bundles",
    image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_3tdqn2t1mn806b5pyjvcnfxqn1/db7e08e7a25e3bacdc6ac07187f0e517_1791195141870.png",
    availability: "in_stock"
  }
];

export default function Shop() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const ProductSchema = (product: Product) => ({
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'PIVIT Fishing'
    },
    offers: {
      '@type': 'Offer',
      url: `https://shop.pivitfishing.com/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toString(),
      availability: product.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OnlineOnly'
    }
  });

  return (
    <div className="shop-container">
      {/* Header */}
      <header className="shop-header">
        <div className="shop-header-content">
          <div className="shop-logo">
            <a href="https://www.pivitfishing.com" className="back-to-main">
              <ArrowLeft size={20} />
              <span>Back to PIVIT Fishing</span>
            </a>
          </div>
          <button
            className="cart-button"
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </header>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          schema={ProductSchema(selectedProduct)}
        />
      )}

      {!selectedProduct && !showCart && (
        <>
          {/* Brand Story */}
          <section className="brand-story">
            <div className="brand-story-content">
              <h1>PIVIT Fishing</h1>
              <h2>Premium Jigs & Lures</h2>
              <p>
                PIVIT is engineered to catch more, built to make a difference. Hand-crafted from Barrington, NH,
                our premium fishing tackle features lead-free construction and revolutionary changeable jig hooks
                powered by TurboCAM technology.
              </p>
              <p>
                Every jig is hand-tied by expert anglers who fish what they make. Engineered for performance.
                Built for sustainability.
              </p>
            </div>
          </section>

          {/* Product Grid */}
          <section className="products-section">
            <div className="products-grid">
              {PRODUCTS.map(product => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.originalPrice && (
                      <div className="sale-badge">SALE</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <div className="price">
                        <span className="current">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="original">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        className="quick-add"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {showCart && (
        <CartView
          cart={cart}
          total={cartTotal}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => {
            setShowCheckout(true);
            setShowCart(false);
          }}
        />
      )}

      {showCheckout && (
        <CheckoutView
          cart={cart}
          total={cartTotal}
          onClose={() => {
            setShowCheckout(false);
            setShowCart(true);
          }}
        />
      )}
    </div>
  );
}

function ProductDetail({ product, onClose, onAddToCart, schema }: any) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="product-detail-grid">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="detail-info">
            <h1>{product.name}</h1>

            <div className="detail-price">
              <span className="current">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="availability">
              {product.availability === 'in_stock' ? (
                <span className="in-stock">✓ In Stock</span>
              ) : (
                <span className="made-to-order">Made to Order - 2-3 weeks</span>
              )}
            </div>

            <p className="detail-description">{product.fullDescription}</p>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  onAddToCart(product);
                }
                onClose();
              }}
            >
              Add to Cart
            </button>

            <div className="product-features">
              <h4>Why Choose PIVIT?</h4>
              <ul>
                <li>✓ Lead-free construction</li>
                <li>✓ Changeable jig hooks (TurboCAM)</li>
                <li>✓ Hand-tied quality</li>
                <li>✓ Made in Barrington, NH</li>
                <li>✓ Engineered by anglers, for anglers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartView({ cart, total, onClose, onUpdateQuantity, onCheckout }: any) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cart-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="cart-item">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CheckoutView({ cart, total, onClose }: any) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [sameBilling, setSameBilling] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = 10.00;
  const finalTotal = total + shippingCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      // Create order
      const orderResponse = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'pivit-fishing', // Shop subdomain tenant
          customerId: null, // Guest checkout
          items: cart.map((item: CartItem) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          subtotal: total,
          tax: 0,
          shipping: shippingCost,
          total: finalTotal,
          shippingAddress: {
            name: fullName,
            street: street,
            city: city,
            state: state,
            zip: zip,
            email: email,
            phone: phone,
          },
          billingAddress: sameBilling ? undefined : {
            name: fullName,
            street: street,
            city: city,
            state: state,
            zip: zip,
          },
        }),
        credentials: 'include'
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      setOrderNumber(orderData.orderNumber);

      // TODO: In production, redirect to Stripe payment here
      // For now, show success message
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
          <div className="success-message">
            <h2>✓ Order Confirmed!</h2>
            <p>Thank you for choosing PIVIT Fishing.</p>
            <p><strong>Order #: {orderNumber}</strong></p>
            <p>A confirmation email has been sent to {email}</p>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '1rem' }}>
              Payment processing will redirect to secure Stripe checkout.
            </p>
            <button onClick={onClose} className="close-btn">Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>Checkout</h2>

        {error && <div style={{ color: 'red', padding: '10px', marginBottom: '1rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleCheckout} className="checkout-form">
          <div className="form-section">
            <h3>Contact</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <h3>Shipping Address</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Street Address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Billing Address</h3>
            <label>
              <input
                type="checkbox"
                checked={sameBilling}
                onChange={(e) => setSameBilling(e.target.checked)}
              />
              Same as shipping
            </label>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)}):</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="checkout-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </button>
        </form>
      </div>
    </div>
  );
}
