/**
 * React Query Hooks with SQLite Persistence
 * Provides intelligent caching with offline support
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { insert, findAll, findWhere, update } from '../lib/db/dbManager';
import { addToSyncQueue } from '../lib/offline/syncQueue';

const QUERY_KEYS = {
  products: 'products',
  inventory: 'inventory',
  customers: 'customers',
  salesHistory: 'salesHistory',
  sales: 'sales',
};

// Cache time settings
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 2 * 60 * 1000; // 2 minutes

/**
 * Hook: Fetch and cache products
 */
export function useProducts(shopId, tenantId) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEYS.products, shopId],
    queryFn: async () => {
      try {
        // Try fetching from server
        const response = await axiosClient.get('/products', {
          params: { shopId, tenantId },
        });

        const products = response.data;

        // Cache in SQLite for offline
        for (const product of products) {
          const existing = findWhere('products', { id: product.id });
          if (existing.length > 0) {
            update('products', product.id, product);
          } else {
            insert('products', {
              id: product.id,
              shopId: product.shopId,
              tenantId: product.tenantId,
              name: product.name,
              sku: product.sku,
              category: product.category,
              costPrice: product.costPrice,
              sellingPrice: product.sellingPrice,
              quantity: product.quantity,
              description: product.description,
              image: product.image,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              isArchived: product.isArchived,
            });
          }
        }

        return products;
      } catch (error) {
        // If offline, get from cache
        if (!navigator.onLine) {
          console.log('Loading products from cache...');
          const cached = findAll('products');
          return cached.filter(p => p.shopId === shopId);
        }
        throw error;
      }
    },
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    retry: 2,
  });
}

/**
 * Hook: Fetch and cache inventory
 */
export function useInventory(shopId, tenantId) {
  return useQuery({
    queryKey: [QUERY_KEYS.inventory, shopId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/inventory', {
          params: { shopId, tenantId },
        });

        const inventory = response.data;

        // Cache in SQLite
        for (const item of inventory) {
          const existing = findWhere('inventory', { id: item.id });
          if (existing.length > 0) {
            update('inventory', item.id, item);
          } else {
            insert('inventory', {
              id: item.id,
              productId: item.productId,
              shopId: item.shopId,
              tenantId: item.tenantId,
              currentQty: item.currentQty,
              lastUpdated: item.lastUpdated,
            });
          }
        }

        return inventory;
      } catch (error) {
        if (!navigator.onLine) {
          console.log('Loading inventory from cache...');
          const cached = findAll('inventory');
          return cached.filter(inv => inv.shopId === shopId);
        }
        throw error;
      }
    },
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    retry: 2,
  });
}

/**
 * Hook: Fetch and cache customers
 */
export function useCustomers(tenantId) {
  return useQuery({
    queryKey: [QUERY_KEYS.customers, tenantId],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/customers', {
          params: { tenantId },
        });

        const customers = response.data;

        // Cache in SQLite
        for (const customer of customers) {
          const existing = findWhere('customers', { id: customer.id });
          if (existing.length > 0) {
            update('customers', customer.id, customer);
          } else {
            insert('customers', {
              id: customer.id,
              tenantId: customer.tenantId,
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              loyaltyPoints: customer.loyaltyPoints,
              createdAt: customer.createdAt,
              updatedAt: customer.updatedAt,
            });
          }
        }

        return customers;
      } catch (error) {
        if (!navigator.onLine) {
          console.log('Loading customers from cache...');
          return findAll('customers');
        }
        throw error;
      }
    },
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    retry: 2,
  });
}

/**
 * Hook: Fetch sales history
 */
export function useSalesHistory(shopId, tenantId, limit = 50) {
  return useQuery({
    queryKey: [QUERY_KEYS.salesHistory, shopId, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/sales', {
          params: { shopId, tenantId, limit },
        });

        const sales = response.data;

        // Cache in SQLite
        for (const sale of sales) {
          const existing = findWhere('sales', { id: sale.id });
          if (existing.length > 0) {
            update('sales', sale.id, sale);
          } else {
            insert('sales', {
              id: sale.id,
              offlineId: sale.offlineId,
              shopId: sale.shopId,
              tenantId: sale.tenantId,
              userId: sale.userId,
              totalAmount: sale.totalAmount,
              paymentType: sale.paymentType,
              customerId: sale.customerId,
              status: sale.status || 'completed',
              syncedAt: sale.syncedAt,
              createdOffline: sale.createdOffline || false,
              createdAt: sale.createdAt,
              updatedAt: sale.updatedAt,
            });
          }
        }

        return sales;
      } catch (error) {
        if (!navigator.onLine) {
          console.log('Loading sales history from cache...');
          const cached = findWhere('sales', { shopId });
          return cached.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
          ).slice(0, limit);
        }
        throw error;
      }
    },
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    retry: 2,
  });
}

/**
 * Mutation: Create a product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData) => {
      return await axiosClient.post('/products', productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
    },
  });
}

/**
 * Mutation: Create a sale (with offline support)
 */
export function useCreateSale(shopId, tenantId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (saleData) => {
      const response = await axiosClient.post('/sales', {
        ...saleData,
        shopId,
        tenantId,
      });

      // If queued (offline), return the response as-is
      if (response.status === 202) {
        return response.data;
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate sales history to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.salesHistory] });
    },
  });
}

/**
 * Mutation: Update customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, customerData }) => {
      return await axiosClient.put(`/customers/${id}`, customerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
    },
  });
}

/**
 * Mutation: Update inventory
 */
export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity, type = 'IN' }) => {
      return await axiosClient.post('/inventory/movement', {
        productId,
        quantity,
        type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
    },
  });
}

/**
 * Utility: Get cached products locally (without network call)
 */
export function getCachedProducts(shopId) {
  try {
    return findWhere('products', { shopId });
  } catch (error) {
    console.error('Failed to get cached products:', error);
    return [];
  }
}

/**
 * Utility: Get cached customers locally
 */
export function getCachedCustomers() {
  try {
    return findAll('customers');
  } catch (error) {
    console.error('Failed to get cached customers:', error);
    return [];
  }
}

/**
 * Utility: Get cached inventory locally
 */
export function getCachedInventory(shopId) {
  try {
    return findWhere('inventory', { shopId });
  } catch (error) {
    console.error('Failed to get cached inventory:', error);
    return [];
  }
}
