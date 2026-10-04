import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import client from '../api/client';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = getTotal();
      const tax = total * 0.1;
      const shipping = 10;

      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
      };

      const orderPayload = {
        tenantId: 'TENANT_ID', // Replace with actual tenant ID
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        })),
        subtotal: total,
        tax: tax,
        shipping: shipping,
        total: total + tax + shipping,
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress,
      };

      const response = await client.post('/api/orders', orderPayload);

      if (response.status === 201) {
        clearCart();
        navigate(`/order-confirmation/${response.data.order.id}`);
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-2xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-secondary px-6 py-2"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="input mt-4"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input mt-4"
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
                required
                className="input mt-4"
              />

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              <p className="text-gray-600 mb-4">This is a demo. Stripe integration coming soon.</p>

              <input
                type="text"
                placeholder="Card Number"
                disabled
                className="input opacity-50"
              />
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  className="input opacity-50"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  disabled
                  className="input opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card sticky top-20">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 pb-4 border-b">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(getTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(getTotal() + getTotal() * 0.1 + 10).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
