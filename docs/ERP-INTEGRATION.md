# ERP Integration Guide - GloblexAI Office ERP Copilot

## Overview

PIVIT Fishing's e-commerce platform includes bi-directional real-time synchronization with GloblexAI's Office ERP Copilot. This integration ensures inventory, orders, and accounting data stay synchronized across systems.

## Configuration

### 1. GloblexAI Setup

**Get API Credentials:**
1. Log in to GloblexAI Office ERP Copilot
2. Navigate to Settings → API Keys
3. Generate new API key
4. Copy API Key and Base URL

**Add to Backend Environment:**
```env
ERP_API_URL=https://api.globlex.ai
ERP_API_KEY=your_generated_api_key
ERP_SYNC_INTERVAL=300000  # 5 minutes
```

### 2. Webhook Configuration (Planned)

Configure GloblexAI to send webhooks:
```
POST https://api.pivitfishing.com/webhooks/erp
{
  "event": "inventory.updated",
  "data": { ... }
}
```

## Sync Flows

### Orders Synchronization

**Direction:** E-Commerce → ERP

**Triggered on:**
- New order created
- Order status updated
- Payment received
- Refund issued

**Data Synced:**
```json
{
  "order_id": "uuid",
  "order_number": "ORD-1704110400000",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "items": [
    {
      "sku": "ROD-001",
      "quantity": 2,
      "unit_price": 129.99
    }
  ],
  "totals": {
    "subtotal": 259.98,
    "tax": 25.99,
    "shipping": 10.00,
    "total": 295.97
  },
  "status": "processing",
  "created_at": "2024-01-01T12:00:00Z"
}
```

**ERP Fields Mapped:**
- Sales Order (SO) creation
- Line item tracking
- Customer account update
- General Ledger posting

### Inventory Synchronization

**Direction:** Bi-directional

**E-Commerce → ERP:**
- Product additions
- Stock quantity changes
- Out-of-stock alerts
- SKU updates

**ERP → E-Commerce:**
- Inventory adjustments
- Stock level corrections
- New product synchronization

**Sync Data:**
```json
{
  "sku": "ROD-001",
  "product_name": "Fishing Rod",
  "quantity_on_hand": 150,
  "quantity_reserved": 25,
  "quantity_available": 125,
  "location": "Warehouse-1",
  "last_updated": "2024-01-01T12:30:00Z"
}
```

### Customer Synchronization

**Direction:** E-Commerce → ERP

**Triggered on:**
- New customer registration
- Profile updates
- Address changes

**Data Synced:**
```json
{
  "customer_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "addresses": [
    {
      "type": "billing",
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "postal_code": "62701",
      "country": "US"
    }
  ],
  "created_at": "2024-01-01T10:00:00Z"
}
```

**ERP Fields Mapped:**
- Customer master (AR01)
- Bill-to and Ship-to addresses
- Contact information

### Accounting Integration

**GL Postings:**
- Sales revenue recognition
- Sales tax payable
- Accounts receivable
- Cost of goods sold
- Inventory adjustments

**GL Account Mappings:**
```
Sales Revenue:        4100-00-0000
Sales Tax Payable:    2200-00-0000
AR Account:           1100-00-0000
COGS:                 5100-00-0000
Inventory:            1200-00-0000
```

## Error Handling & Retry Logic

### Sync Failure Scenarios

**Network Issues:**
- Automatic retry with exponential backoff
- Max 3 retry attempts
- 5 minute wait before first retry

**Data Validation Failures:**
- Log error to sync_logs table
- Alert admin via dashboard
- Manual sync trigger option

**Partial Sync Failures:**
- Rollback transaction
- Log detailed error message
- Retry entire batch

### Monitoring Sync Health

**Dashboard Metrics:**
```javascript
- Sync Success Rate (%)
- Avg Sync Time (ms)
- Pending Syncs
- Failed Syncs (last 24h)
- Last Successful Sync
```

**Alerts:**
- Sync failure > 3 times
- Sync time > 2 seconds
- Pending queue > 100 items
- API key expiration warning

## API Endpoints Reference

### Orders Sync

**Endpoint:**
```
POST https://api.globlex.ai/sync/orders
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Request:**
```json
{
  "tenant_id": "uuid",
  "orders": [
    {
      "id": "uuid",
      "order_number": "ORD-1704110400000",
      "status": "processing",
      "total": 295.97,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "synced": 1,
  "failed": 0,
  "erp_order_numbers": ["ERP-001"]
}
```

### Inventory Sync

**Endpoint:**
```
POST https://api.globlex.api/sync/inventory
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Request:**
```json
{
  "tenant_id": "uuid",
  "inventory": [
    {
      "sku": "ROD-001",
      "quantity": 125,
      "warehouse": "WH-001"
    }
  ]
}
```

## Manual Sync Triggers

### Admin Dashboard

Admin users can manually trigger sync:
```
POST /api/admin/sync
{
  "tenantId": "uuid",
  "syncType": "orders|inventory|customers",
  "startDate": "2024-01-01"
}
```

### CLI Command (Planned)

```bash
npm run erp:sync -- --type orders --tenant uuid
```

## Testing & Validation

### Test Environment Setup

1. **GloblexAI Test Tenant**
   - Create separate test tenant
   - Configure test API key
   - Test with dummy data

2. **Mock API Server (for development)**
   ```bash
   npm run mock-erp-server
   # Starts server on :3002 with mock endpoints
   ```

3. **Test Scenarios**
   ```
   - Single product order
   - Multi-item order
   - Inventory adjustment
   - Customer update
   - Partial sync failure
   - Network timeout
   ```

### Validation Checklist

- [ ] Orders sync correctly
- [ ] Inventory updates in real-time
- [ ] Customer data matches
- [ ] GL entries balanced
- [ ] Error logs clean
- [ ] Retry mechanism works
- [ ] Webhook received confirmation
- [ ] Dashboard shows correct metrics

## Troubleshooting

### Sync Not Triggering

**Check:**
```bash
# Verify ERP_API_KEY is set
echo $ERP_API_KEY

# Check sync logs
SELECT * FROM erp_sync_logs ORDER BY created_at DESC LIMIT 10;

# Monitor background worker
pm2 logs erp-sync-worker
```

**Fix:**
```bash
# Manually trigger sync
curl -X POST http://localhost:3001/api/admin/sync \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"uuid","syncType":"orders"}'
```

### Authentication Failures

**Error:** `401 Unauthorized`

**Fix:**
1. Verify API key in environment
2. Check API key expiration in GloblexAI
3. Regenerate API key if necessary
4. Restart backend service

### Data Mismatches

**Symptom:** Order in e-commerce but not in ERP

**Investigation:**
```sql
-- Check sync logs
SELECT * FROM erp_sync_logs 
WHERE tenant_id = 'uuid' 
AND sync_type = 'orders'
ORDER BY created_at DESC;

-- Check pending orders
SELECT id, order_number, status 
FROM orders 
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;
```

**Resolution:**
- Review error message in sync_logs
- Fix data validation issue
- Manually trigger retry

## Performance Optimization

### Batch Processing

Orders sync in batches to improve performance:
- Batch size: 50 orders
- Batch interval: 5 minutes
- Max concurrent syncs: 1

### Caching Strategy

Cache ERP data locally:
- Product catalog: 1 hour TTL
- Customer data: 24 hour TTL
- Inventory: 15 minute TTL

### Rate Limiting

GloblexAI API has rate limits:
- 100 requests/minute
- 10,000 requests/day
- Backoff: 60 seconds on limit exceeded

## Audit Trail

All sync activity logged for compliance:

```sql
SELECT * FROM erp_sync_logs
WHERE tenant_id = 'uuid'
AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

**Log Fields:**
- sync_id
- tenant_id
- sync_type
- status (completed/failed)
- records_synced
- error_message
- created_at
- updated_at

## Future Enhancements

- [ ] Real-time webhook integration
- [ ] Two-way inventory sync
- [ ] Multi-currency support
- [ ] Advanced tax integration
- [ ] Automated reconciliation reports
- [ ] Custom field mapping
- [ ] Batch job scheduling UI
