import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  const total = getTotal();
  const tax = total * 0.1; // 10% tax
  const shipping = items.length > 0 ? 10 : 0;
  const grandTotal = total + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-16">
          <p className="text-2xl text-gray-600 mb-8">Your cart is empty</p>
          <Link to="/products" className="btn btn-secondary px-8 py-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="card">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 pb-6 border-b last:border-b-0">
                <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>🎣</span>
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-secondary text-lg">${item.price.toFixed(2)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="btn btn-outline px-2 py-1 text-sm"
                    >
                      −
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="btn btn-outline px-2 py-1 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-danger text-sm hover:underline mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={clearCart} className="btn btn-outline mt-4">
            Clear Cart
          </button>
        </div>

        <div>
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary w-full text-center py-3 block">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="btn btn-outline w-full text-center py-3 block mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
