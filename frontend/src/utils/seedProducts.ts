import { pivitProducts } from '../data/pivit-products';
import client from '../api/client';

/**
 * Seed the database with PIVIT Fishing products
 * This function uploads all products to the backend
 */
export async function seedPIVITProducts(tenantId: string): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    console.log(`Seeding ${pivitProducts.length} PIVIT products for tenant ${tenantId}...`);

    // Upload each product to the backend
    const uploadPromises = pivitProducts.map((product) =>
      client.post('/api/products?tenantId=' + tenantId, {
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        images: product.images,
      })
    );

    const results = await Promise.allSettled(uploadPromises);

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`✓ Seeded ${successful} products successfully`);
    if (failed > 0) {
      console.warn(`✗ Failed to seed ${failed} products`);
    }

    return {
      success: failed === 0,
      count: successful,
      error: failed > 0 ? `${failed} products failed to upload` : undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to seed products:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get seed status - check if products already exist
 */
export async function checkProductsExist(tenantId: string): Promise<boolean> {
  try {
    const response = await client.get(`/api/products?tenantId=${tenantId}&limit=1`);
    return (response.data.products || []).length > 0;
  } catch (error) {
    console.warn('Failed to check products:', error);
    return false;
  }
}

/**
 * Display seed status in admin dashboard
 */
export function renderSeedButton(tenantId: string, onSeed?: () => void) {
  return {
    title: 'Seed Sample Products',
    description: 'Load PIVIT Fishing sample products into your shop',
    onSeed: async () => {
      const exists = await checkProductsExist(tenantId);
      if (exists) {
        console.warn('Products already exist in this shop');
        return;
      }

      const result = await seedPIVITProducts(tenantId);
      if (result.success) {
        console.log(`Successfully seeded ${result.count} products!`);
        if (onSeed) onSeed();
      } else {
        console.error(`Failed to seed products: ${result.error}`);
      }
    },
  };
}
