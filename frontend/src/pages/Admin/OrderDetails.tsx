import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../../api/client';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: OrderItem[];
  shipping_address: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billing_address: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  tracking_number?: string;
  carrier?: string;
  carrier_url?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('usps');
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/api/orders/${orderId}?tenantId=TENANT_ID`);
      setOrder(response.data);
      setNotes(response.data.notes || '');
      setTrackingNumber(response.data.tracking_number || '');
      setCarrier(response.data.carrier || 'usps');
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      await client.patch(`/api/orders/${orderId}/status?tenantId=TENANT_ID`, {
        status: newStatus,
      });
      setOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      await client.patch(`/api/orders/${orderId}/payment-status?tenantId=TENANT_ID`, {
        payment_status: newStatus,
      });
      setOrder((prev) => (prev ? { ...prev, payment_status: newStatus as any } : null));
    } catch (error) {
      alert('Failed to update payment status');
    }
  };

  const handleUpdateTracking = async () => {
    if (!order) return;
    try {
      await client.patch(`/api/orders/${orderId}/tracking?tenantId=TENANT_ID`, {
        tracking_number: trackingNumber,
        carrier: carrier,
      });
      setOrder((prev) => (prev ? { ...prev, tracking_number: trackingNumber, carrier: carrier } : null));
      setShowTrackingForm(false);
      alert('Tracking information updated');
    } catch (error) {
      alert('Failed to update tracking');
    }
  };

  const handleUpdateNotes = async () => {
    if (!order) return;
    try {
      await client.patch(`/api/orders/${orderId}/notes?tenantId=TENANT_ID`, {
        notes: notes,
      });
      setOrder((prev) => (prev ? { ...prev, notes: notes } : null));
      setShowNoteForm(false);
      alert('Notes updated');
    } catch (error) {
      alert('Failed to update notes');
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Link to="/admin/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

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

  const carriers = [
    { value: 'usps', label: 'USPS', url: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' },
    { value: 'fedex', label: 'FedEx', url: 'https://tracking.fedex.com/en/tracking/' },
    { value: 'ups', label: 'UPS', url: 'https://www.ups.com/track?tracknum=' },
    { value: 'dhl', label: 'DHL', url: 'https://www.dhl.com/en/en/shipped.html?AWB=' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/admin/orders" className="text-secondary hover:underline mb-6 block">
        ← Back to Orders
      </Link>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Order Header */}
        <div className="md:col-span-2">
          <div className="card mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold">{order.order_number}</h1>
                <p className="text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Status Updates */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold mb-2">Order Status</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
                <span className={`inline-block mt-2 px-3 py-1 rounded text-white text-xs font-bold capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Payment Status</label>
                <select
                  value={order.payment_status}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <span className={`inline-block mt-2 px-3 py-1 rounded text-white text-xs font-bold capitalize ${paymentStatusColors[order.payment_status]}`}>
                  {order.payment_status}
                </span>
              </div>
            </div>

            {/* Tracking Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Shipment Tracking</h2>
                <button onClick={() => setShowTrackingForm(!showTrackingForm)} className="btn btn-outline btn-sm">
                  {showTrackingForm ? '✕ Close' : '+ Update'}
                </button>
              </div>

              {showTrackingForm ? (
                <div className="bg-light p-4 rounded mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Carrier</label>
                      <select
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        {carriers.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Tracking Number</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Enter tracking number"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleUpdateTracking} className="btn btn-primary btn-sm">
                      Save
                    </button>
                    <button onClick={() => setShowTrackingForm(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {order.tracking_number ? (
                    <div className="bg-light p-4 rounded">
                      <p className="text-sm text-gray-600">Carrier</p>
                      <p className="font-bold mb-3">{order.carrier?.toUpperCase()}</p>

                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-bold mb-3">{order.tracking_number}</p>

                      {order.carrier_url && (
                        <a
                          href={order.carrier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Track Package →
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No tracking information yet</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="card">
            <h3 className="font-bold mb-4">Customer Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-bold">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-bold break-all">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-bold">{order.customer_phone || '—'}</p>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="card">
            <h3 className="font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-6">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-bold">Product</th>
                <th className="text-right py-3 px-4 font-bold">Qty</th>
                <th className="text-right py-3 px-4 font-bold">Price</th>
                <th className="text-right py-3 px-4 font-bold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4">{item.productName}</td>
                  <td className="text-right py-3 px-4">{item.quantity}</td>
                  <td className="text-right py-3 px-4">${item.price.toFixed(2)}</td>
                  <td className="text-right py-3 px-4 font-bold">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-bold mb-4">Shipping Address</h3>
          <div className="text-sm space-y-1">
            <p>{order.shipping_address.address_line_1}</p>
            {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
            </p>
            <p>{order.shipping_address.country}</p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4">Billing Address</h3>
          <div className="text-sm space-y-1">
            <p>{order.billing_address.address_line_1}</p>
            {order.billing_address.address_line_2 && <p>{order.billing_address.address_line_2}</p>}
            <p>
              {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}
            </p>
            <p>{order.billing_address.country}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Order Notes</h3>
          <button onClick={() => setShowNoteForm(!showNoteForm)} className="btn btn-outline btn-sm">
            {showNoteForm ? '✕ Close' : '+ Edit'}
          </button>
        </div>

        {showNoteForm ? (
          <div className="mb-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 mb-3 h-24"
              placeholder="Add internal notes about this order..."
            />
            <div className="flex gap-2">
              <button onClick={handleUpdateNotes} className="btn btn-primary btn-sm">
                Save Notes
              </button>
              <button onClick={() => setShowNoteForm(false)} className="btn btn-outline btn-sm">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">{notes || 'No notes yet'}</p>
        )}
      </div>
    </div>
  );
}
