import { useState, useEffect } from 'react';
import client from '../../api/client';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
  sku?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'jigs',
    stock: '',
    sku: '',
    images: [''],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await client.get('/api/products?tenantId=TENANT_ID&limit=100');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: newImages.filter((img) => img.trim() !== ''),
    }));
  };

  const handleAddImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(String(formData.price)),
        stock: parseInt(String(formData.stock)) || 0,
      };

      if (editingId) {
        await client.patch(`/api/products/${editingId}?tenantId=TENANT_ID`, payload);
      } else {
        await client.post('/api/products?tenantId=TENANT_ID', payload);
      }

      await fetchProducts();
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'jigs',
        stock: '',
        sku: '',
        images: [''],
      });
      setEditingId(null);
      setShowForm(false);
      alert(editingId ? 'Product updated successfully' : 'Product added successfully');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      stock: String(product.stock),
      sku: product.sku || '',
      images: product.images.length > 0 ? product.images : [''],
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await client.delete(`/api/products/${id}?tenantId=TENANT_ID`);
        await fetchProducts();
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'jigs',
      stock: '',
      sku: '',
      images: [''],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categories = ['jigs', 'lures', 'hooks', 'tackle', 'apparel'];
  const filteredProducts = filter === 'all' ? products : products.filter((p) => p.category === filter);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Close' : '+ Add Product'}
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="card mb-8 bg-light p-6">
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-bold mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="e.g., Premium Jig Head"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="e.g., JH-001"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 h-24"
                placeholder="Product description..."
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Product Images (URLs)</label>
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-4 py-2"
                      placeholder="https://example.com/image.jpg"
                    />
                    {image && (
                      <div className="w-16 h-16 border rounded overflow-hidden">
                        <img src={image} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddImageField}
                className="mt-3 btn btn-outline btn-sm"
              >
                + Add Image
              </button>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold mt-1">{products.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Low Stock Items</p>
          <p className="text-3xl font-bold mt-1 text-warning">{lowStockCount}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Total Inventory Value</p>
          <p className="text-3xl font-bold mt-1">
            ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} whitespace-nowrap`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline'} whitespace-nowrap capitalize`}
          >
            {cat} ({products.filter((p) => p.category === cat).length})
          </button>
        ))}
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No products found</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Add your first product
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-bold">Product</th>
                <th className="text-left py-3 px-4 font-bold">SKU</th>
                <th className="text-right py-3 px-4 font-bold">Price</th>
                <th className="text-right py-3 px-4 font-bold">Stock</th>
                <th className="text-left py-3 px-4 font-bold">Category</th>
                <th className="text-left py-3 px-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-light">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {product.images && product.images[0] && (
                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <p className="text-gray-600 text-xs line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-600">{product.sku || '—'}</td>
                  <td className="py-4 px-4 text-right font-bold">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        product.stock < 10 ? 'bg-warning text-white' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-4 capitalize text-xs text-gray-600">{product.category}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
