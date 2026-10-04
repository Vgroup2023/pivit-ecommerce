export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  owner_id: string;
  logo_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  category: string;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  payment_intent_id: string;
  tracking_number: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  addresses: Address[];
  created_at: Date;
  updated_at: Date;
}

export interface ERPSyncLog {
  id: string;
  tenant_id: string;
  sync_type: 'orders' | 'inventory' | 'customers' | 'products';
  status: 'pending' | 'completed' | 'failed';
  records_synced: number;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AdminUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'admin' | 'fulfillment' | 'finance' | 'viewer';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SessionData {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
}
