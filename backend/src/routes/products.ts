import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getProductsByTenant, getProductById, createProduct, updateProduct, updateInventory } from '../services/productService';
import { requireAuth, requireAdminRole, requireTenant } from '../middleware/auth';

const router = Router();

// Get all products for tenant
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const products = await getProductsByTenant(tenantId as string, limit, offset);
    res.json({ products, limit, offset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const product = await getProductById(req.params.id, tenantId as string);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post(
  '/',
  requireAuth,
  requireAdminRole,
  [
    body('tenantId').notEmpty(),
    body('name').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('description').optional().trim(),
    body('sku').optional().trim(),
    body('cost').optional().isFloat({ min: 0 }),
    body('stockQuantity').optional().isInt({ min: 0 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tenantId, name, price, description, sku, cost, stockQuantity, images } = req.body;

      const product = await createProduct(
        tenantId,
        name,
        price,
        description,
        sku,
        cost,
        stockQuantity || 0,
        images || []
      );

      res.status(201).json({ product });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (admin only)
router.put(
  '/:id',
  requireAuth,
  requireAdminRole,
  async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.query;
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID required' });
      }

      const product = await updateProduct(req.params.id, tenantId as string, req.body);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ product });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

export default router;
