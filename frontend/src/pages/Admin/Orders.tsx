import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  total: number;
  created_at: string;
  tracking_number?: string;
  carrier?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await client.get('/api/orders?tenantId=TENANT_ID&limit=100');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const filteredOrders = orders.filter((o) => {
    const statusMatch = filter === 'all' || o.status === filter;
    const paymentMatch = paymentFilter === 'all' || o.payment_status === paymentFilter;
    return statusMatch && paymentMatch;
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-warning',
    paid: 'bg-info',
    processing: 'bg-blue-500',
    shipped: 'bg-blue-600',
    delivered: 'bg-success',
    cancelled: 'bg-danger',
    refunded: 'bg-gray-500',
  };

  const paymentStatusColors: Record<string, string> = {
    pending: 'bg-warning',
    paid: 'bg-success',
    failed: 'bg-danger',
    refunded: 'bg-gray-500',
  };

  const revenueByStatus = (status: string) => {
    return orders
      .filter((o) => o.status === status && o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="text-right">
          <p className="text-gray-600">Total Orders</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm">Pending Payment</p>
          <p className="text-3xl font-bold">{orders.filter((o) => o.payment_status === 'pending').length}</p>
          <p className="text-secondary text-sm mt-1">${revenueByStatus('pending').toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Processing</p>
          <p className="text-3xl font-bold">{orders.filter((o) => o.status === 'processing').length}</p>
          <p className="text-secondary text-sm mt-1">${revenueByStatus('processing').toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Shipped</p>
          <p className="text-3xl font-bold">{orders.filter((o) => o.status === 'shipped').length}</p>
          <p className="text-secondary text-sm mt-1">${revenueByStatus('shipped').toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Delivered</p>
          <p className="text-3xl font-bold">{orders.filter((o) => o.status === 'delivered').length}</p>
          <p className="text-secondary text-sm mt-1">${revenueByStatus('delivered').toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <p className="text-sm font-bold mb-2">Order Status</p>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} whitespace-nowrap`}
            >
              All ({orders.length})
            </button>
            {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'} whitespace-nowrap capitalize`}
              >
                {status} ({orders.filter((o) => o.status === status).length})
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold mb-2">Payment Status</p>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setPaymentFilter('all')}
              className={`btn ${paymentFilter === 'all' ? 'btn-primary' : 'btn-outline'} whitespace-nowrap`}
            >
              All ({orders.length})
            </button>
            {['pending', 'paid', 'failed', 'refunded'].map((status) => (
              <button
                key={status}
                onClick={() => setPaymentFilter(status)}
                className={`btn ${paymentFilter === status ? 'btn-primary' : 'btn-outline'} whitespace-nowrap capitalize`}
              >
                {status} ({orders.filter((o) => o.payment_status === status).length})
              </button>
            ))}
          </div>
        </div>
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
            <thead className="border-b bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-bold">Order #</th>
                <th className="text-left py-3 px-4 font-bold">Customer</th>
                <th className="text-left py-3 px-4 font-bold">Date</th>
                <th className="text-right py-3 px-4 font-bold">Total</th>
                <th className="text-left py-3 px-4 font-bold">Status</th>
                <th className="text-left py-3 px-4 font-bold">Payment</th>
                <th className="text-left py-3 px-4 font-bold">Tracking</th>
                <th className="text-left py-3 px-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-light">
                  <td className="py-4 px-4 font-bold">{order.order_number}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-bold text-sm">{order.customer_name}</p>
                      <p className="text-gray-600 text-xs">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-right font-bold">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded text-white text-xs font-bold capitalize ${statusColors[order.status] || 'bg-gray-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded text-white text-xs font-bold capitalize ${paymentStatusColors[order.payment_status] || 'bg-gray-500'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-600">
                    {order.tracking_number ? (
                      <div>
                        <p className="font-bold">{order.carrier?.toUpperCase()}</p>
                        <p>{order.tracking_number}</p>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Link to={`/admin/orders/${order.id}`} className="btn btn-primary btn-sm">
                      Details
                    </Link>
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
