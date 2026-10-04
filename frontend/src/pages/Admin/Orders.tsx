import { useState, useEffect } from 'react';
import client from '../../api/client';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  tracking_number?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await client.get('/api/orders?tenantId=TENANT_ID');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(`/api/orders/${orderId}/status?tenantId=TENANT_ID`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      alert('Failed to update order status');
      console.error(error);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-warning',
    paid: 'bg-info',
    processing: 'bg-blue-500',
    shipped: 'bg-blue-600',
    delivered: 'bg-success',
    cancelled: 'bg-danger',
    refunded: 'bg-gray-500',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} whitespace-nowrap`}
        >
          All ({orders.length})
        </button>
        {['pending', 'paid', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'} whitespace-nowrap capitalize`}
          >
            {status} ({orders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 px-4 font-bold">Order #</th>
                <th className="text-left py-3 px-4 font-bold">Date</th>
                <th className="text-left py-3 px-4 font-bold">Total</th>
                <th className="text-left py-3 px-4 font-bold">Status</th>
                <th className="text-left py-3 px-4 font-bold">Tracking</th>
                <th className="text-left py-3 px-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-light">
                  <td className="py-4 px-4 font-bold">{order.order_number}</td>
                  <td className="py-4 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-4">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded text-white text-xs font-bold capitalize ${statusColors[order.status] || 'bg-gray-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-xs">{order.tracking_number || '—'}</td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
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
