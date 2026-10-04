import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import client from '../api/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  category: string;
  stock_quantity: number;
  images: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await client.get(`/api/products/${id}?tenantId=TENANT_ID`);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0],
    });
    alert('Added to cart!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-4">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">🎣</span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div key={idx} className="bg-gray-200 h-20 rounded">
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">SKU: {product.sku}</p>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{product.category}</p>
          </div>

          <div className="bg-light rounded-lg p-6 mb-6">
            <p className="text-4xl font-bold text-secondary mb-2">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-2">
              {product.stock_quantity > 0 ? (
                <span className="text-success font-bold">✓ In Stock</span>
              ) : (
                <span className="text-danger font-bold">Out of Stock</span>
              )}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn btn-outline px-4 py-2"
              >
                −
              </button>
              <span className="text-2xl font-bold px-6">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock_quantity}
                className="btn btn-outline px-4 py-2 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="btn btn-primary w-full py-3 text-lg disabled:opacity-50"
          >
            {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-bold mb-4">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-bold">SKU:</span>
                <span>{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Category:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Available:</span>
                <span>{product.stock_quantity} units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
