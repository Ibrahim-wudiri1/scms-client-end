/**
 * Sync Engine
 * Orchestrates priority-based syncing of offline data to server
 */

import axiosClient from '../../api/axiosClient';
import { useOfflineStore } from '../../store/offlineStore';
import {
  getPendingItems,
  getQueueByPriority,
  getFailedItems,
  updateQueueItemStatus,
  removeFromQueue,
  setSyncMetadata,
  getSyncMetadata,
} from './syncQueue';
import { findWhere, update } from '../db/dbManager';

/**
 * Main sync engine
 */
export class SyncEngine {
  constructor() {
    this.isSyncing = false;
    this.retryStrategy = {
      maxRetries: 3,
      initialDelay: 1000, // 1 second
      maxDelay: 30000, // 30 seconds
    };
  }

  /**
   * Start syncing process
   */
  async startSync() {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('Offline - cannot sync');
      return;
    }

    const store = useOfflineStore.getState();
    store.startSync();
    this.isSyncing = true;

    try {
      const queueItems = getQueueByPriority();

      if (queueItems.length === 0) {
        console.log('✓ No items to sync');
        store.completeSync();
        this.isSyncing = false;
        return;
      }

      console.log(`Starting sync of ${queueItems.length} items`);
      store.updateSyncProgress(0, queueItems.length);

      // Group items by entity type and priority
      const grouped = this.groupQueueItems(queueItems);

      let successCount = 0;
      let currentIndex = 0;

      // Sync in order: Sales → Inventory → Others
      for (const [priority, items] of grouped) {
        for (const item of items) {
          try {
            updateQueueItemStatus(item.id, 'syncing');
            const result = await this.syncItem(item);

            if (result.success) {
              removeFromQueue(item.id);
              successCount++;
              console.log(`✓ Synced ${item.entityType} ${item.entityId}`);
            } else {
              updateQueueItemStatus(item.id, 'failed', result.error);
              console.error(`✗ Failed to sync ${item.entityType}: ${result.error}`);

              // If it's a conflict, add to store
              if (result.conflict) {
                store.addConflict(result.conflict);
              }
            }
          } catch (error) {
            updateQueueItemStatus(item.id, 'failed', error);
            console.error(`✗ Error syncing ${item.entityType}:`, error);
          }

          currentIndex++;
          store.updateSyncProgress(currentIndex, queueItems.length);
        }
      }

      console.log(`✓ Sync completed: ${successCount}/${queueItems.length} succeeded`);
      store.completeSync();
      store.refreshQueueStats();

      // Update last sync time
      setSyncMetadata('lastSyncTime', new Date().toISOString());
    } catch (error) {
      console.error('✗ Sync failed:', error);
      store.setSyncError(error.message || String(error));
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync a single queue item
   */
  async syncItem(item) {
    const payload = typeof item.payload === 'string'
      ? JSON.parse(item.payload)
      : item.payload;

    try {
      // If the payload is a queued HTTP request wrapper, replay it directly
      if (payload.method && payload.url) {
        return await this.replayQueuedRequest(payload);
      }

      switch (item.entityType) {
        case 'SALE':
          return await this.syncSale(payload);
        case 'INVENTORY':
          return await this.syncInventory(payload);
        case 'CUSTOMER':
          return await this.syncCustomer(payload);
        case 'PRODUCT':
          return await this.syncProduct(payload);
        default:
          return { success: false, error: 'Unknown entity type' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async replayQueuedRequest(payload) {
    try {
      const requestData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
      const requestConfig = typeof payload.config === 'string' ? JSON.parse(payload.config) : (payload.config || {});

      await axiosClient({
        method: payload.method,
        url: payload.url,
        data: requestData,
        params: requestConfig.params,
        headers: requestConfig.headers,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync a sale
   */
  async syncSale(saleData) {
    try {
      // First, sync inventory to get current stock levels
      await this.syncInventoryState(saleData.shopId, saleData.tenantId);

      // Check if inventory is still sufficient
      const inventoryCheck = await this.checkInventory(saleData);
      if (!inventoryCheck.ok) {
        return {
          success: false,
          error: inventoryCheck.error,
          conflict: {
            id: `conflict_${Date.now()}`,
            type: 'inventory',
            message: inventoryCheck.message,
            current: inventoryCheck.current,
            required: inventoryCheck.required,
            saleOfflineId: saleData.offlineId,
          },
        };
      }

      // POST sale to server
      const response = await axiosClient.post('/sales/sync', {
        sales: [saleData],
      });

      if (response.data.successful && response.data.successful.length > 0) {
        const syncedSale = response.data.successful[0];

        // Update local sale record with server ID and sync time
        const existingSale = findWhere('sales', { offlineId: saleData.offlineId })[0];
        if (existingSale) {
          update('sales', existingSale.id, {
            id: syncedSale.id || existingSale.id,
            syncedAt: new Date().toISOString(),
            status: 'completed',
          });
        }

        return { success: true };
      } else if (response.data.failed && response.data.failed.length > 0) {
        const error = response.data.failed[0];
        return { success: false, error: error.message };
      }

      return { success: false, error: 'Unknown sync response' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync inventory state from server
   */
  async syncInventoryState(shopId, tenantId) {
    try {
      const response = await axiosClient.get('/inventory/sync', {
        params: { shopId, tenantId },
      });

      // Update local inventory cache with server values
      const inventory = response.data;
      for (const item of inventory) {
        const existing = findWhere('inventory', { id: item.id })[0];
        if (existing) {
          update('inventory', item.id, {
            currentQty: item.currentQty,
            lastUpdated: new Date().toISOString(),
          });
        }
      }

      return true;
    } catch (error) {
      console.warn('Failed to sync inventory state:', error);
      return false;
    }
  }

  /**
   * Check if inventory is sufficient for sale
   */
  async checkInventory(saleData) {
    try {
      const inventory = findWhere('inventory', { shopId: saleData.shopId });
      const inventoryMap = {};
      inventory.forEach(item => {
        inventoryMap[item.productId] = item.currentQty;
      });

      for (const item of saleData.items) {
        const available = inventoryMap[item.productId] || 0;
        if (available < item.quantity) {
          return {
            ok: false,
            error: `Insufficient inventory for product`,
            message: `Product has ${available} units but sale requires ${item.quantity}`,
            current: available,
            required: item.quantity,
            productId: item.productId,
          };
        }
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  /**
   * Sync inventory update
   */
  async syncInventory(inventoryData) {
    try {
      const response = await axiosClient.post('/inventory/sync', inventoryData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync customer creation/update
   */
  async syncCustomer(customerData) {
    try {
      const response = await axiosClient.post('/customers/sync', customerData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync product creation/update
   */
  async syncProduct(productData) {
    try {
      const response = await axiosClient.post('/products/sync', productData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Group queue items by priority and entity type
   */
  groupQueueItems(items) {
    const grouped = new Map();

    items.forEach(item => {
      if (!grouped.has(item.priority)) {
        grouped.set(item.priority, []);
      }
      grouped.get(item.priority).push(item);
    });

    // Sort by priority (ascending)
    return new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]));
  }

  /**
   * Retry failed items with exponential backoff
   */
  async retryFailed() {
    if (!navigator.onLine) {
      console.log('Offline - cannot retry failed items yet');
      return;
    }

    const failedItems = getFailedItems();
    if (failedItems.length === 0) {
      console.log('No failed queue items to retry');
      return;
    }

    for (const item of failedItems) {
      const retryCount = item.retryCount || 0;
      if (retryCount >= this.retryStrategy.maxRetries) {
        console.log(`Skipping ${item.entityType} ${item.entityId} - max retries reached`);
        continue;
      }

      const delay = Math.min(
        this.retryStrategy.initialDelay * Math.pow(2, retryCount),
        this.retryStrategy.maxDelay
      );

      console.log(`Retrying ${item.entityType} ${item.entityId} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));

      updateQueueItemStatus(item.id, 'pending');
    }

    await this.startSync();
  }
}

/**
 * Create and export singleton instance
 */
export const syncEngine = new SyncEngine();

/**
 * Setup event listeners for sync triggers
 */
export function setupSyncEventListeners() {
  // Listen for reconnection event
  window.addEventListener('offline:reconnected', async () => {
    console.log('Reconnected - starting sync...');
    await syncEngine.startSync();
  });

  // Listen for retry event
  window.addEventListener('offline:retryFailed', async () => {
    console.log('Retrying failed sync items...');
    await syncEngine.retryFailed();
  });

  // Listen for online event
  window.addEventListener('online', async () => {
    console.log('Online - starting sync...');
    setTimeout(() => syncEngine.startSync(), 2000); // Give 2 seconds for stability
  });
}
