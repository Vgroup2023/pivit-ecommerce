import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Note: Replace 'TENANT_ID' with actual tenant ID from context/URL
        const response = await client.get('/api/products?tenantId=TENANT_ID&limit=50');
        setProducts(response.data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-danger">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-12">Our Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">No products available yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <div className="card h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gray-200 h-40 mb-4 rounded flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🎣</span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-bold text-secondary">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
