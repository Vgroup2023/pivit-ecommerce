import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    productsInStock: 0,
  });

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    // For now, using placeholder data
    setStats({
      totalOrders: 156,
      totalRevenue: 24580.00,
      pendingOrders: 12,
      productsInStock: 487,
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.firstName}! Here's your business overview.</p>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="card">
          <div className="text-gray-600 text-sm">Total Orders</div>
          <div className="text-3xl font-bold mt-2">{stats.totalOrders}</div>
          <div className="text-green-600 text-sm mt-2">↑ 12% this month</div>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm">Total Revenue</div>
          <div className="text-3xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-green-600 text-sm mt-2">↑ 8% this month</div>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm">Pending Orders</div>
          <div className="text-3xl font-bold mt-2">{stats.pendingOrders}</div>
          <Link to="/admin/orders" className="text-secondary text-sm mt-2 hover:underline">
            View Orders →
          </Link>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm">Products In Stock</div>
          <div className="text-3xl font-bold mt-2">{stats.productsInStock}</div>
          <div className="text-warning text-sm mt-2">⚠ 5 low stock items</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/products" className="block btn btn-outline text-left py-3 px-4">
              🛍️ Manage Products
            </Link>
            <Link to="/admin/orders" className="block btn btn-outline text-left py-3 px-4">
              📦 Manage Orders
            </Link>
            <Link to="#" className="block btn btn-outline text-left py-3 px-4">
              📊 View Reports
            </Link>
            <Link to="#" className="block btn btn-outline text-left py-3 px-4">
              ⚙️ Settings
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4 text-sm">
            <div className="pb-3 border-b">
              <p className="font-bold">Order #ORD-1699450200 Shipped</p>
              <p className="text-gray-600">2 hours ago</p>
            </div>
            <div className="pb-3 border-b">
              <p className="font-bold">New Order #ORD-1699446600</p>
              <p className="text-gray-600">4 hours ago</p>
            </div>
            <div className="pb-3 border-b">
              <p className="font-bold">Payment Received: $450.00</p>
              <p className="text-gray-600">6 hours ago</p>
            </div>
            <div>
              <p className="font-bold">Inventory Alert: Low Stock</p>
              <p className="text-gray-600">12 hours ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* ERP Integration Status */}
      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-4">🔗 ERP Integration Status</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-2xl">✓</span>
              <p className="font-bold">Orders Sync</p>
            </div>
            <p className="text-gray-600 text-sm">Last synced: 15 minutes ago</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-2xl">✓</span>
              <p className="font-bold">Inventory Sync</p>
            </div>
            <p className="text-gray-600 text-sm">Last synced: 5 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
