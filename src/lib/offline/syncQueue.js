/**
 * Sync Queue Manager
 * Handles storage and retrieval of pending sync operations
 */

import { insert, findWhere, update, deleteRecord, findAll } from '../db/dbManager';

/**
 * Add a sync operation to the queue
 */
export async function addToSyncQueue(operationType, entityType, entityId, payload, priority = 3) {
  const queueItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    operationType, // 'CREATE', 'UPDATE', 'DELETE'
    entityType, // 'SALE', 'INVENTORY', 'CUSTOMER', etc.
    entityId,
    payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
    priority, // 1 (sales), 2 (inventory), 3 (others)
    retryCount: 0,
    lastError: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending', // 'pending', 'syncing', 'synced', 'failed'
  };

  try {
    insert('syncQueue', queueItem);
    console.log('✓ Added to sync queue:', queueItem.id);
    return queueItem;
  } catch (error) {
    console.error('✗ Failed to add to sync queue:', error);
    throw error;
  }
}

/**
 * Get all pending queue items
 */
export function getPendingItems() {
  try {
    return findWhere('syncQueue', { status: 'pending' });
  } catch (error) {
    console.error('✗ Failed to get pending items:', error);
    return [];
  }
}

/**
 * Get queue items sorted by priority
 */
export function getQueueByPriority() {
  try {
    const allPending = getPendingItems();
    return allPending.sort((a, b) => a.priority - b.priority);
  } catch (error) {
    console.error('✗ Failed to get queue by priority:', error);
    return [];
  }
}

/**
 * Get failed queue items
 */
export function getFailedItems() {
  try {
    return findWhere('syncQueue', { status: 'failed' });
  } catch (error) {
    console.error('✗ Failed to get failed queue items:', error);
    return [];
  }
}

/**
 * Get queue items by status or all queue items
 */
export function getQueueItems(status = null) {
  try {
    if (status) {
      return findWhere('syncQueue', { status });
    }
    return findAll('syncQueue');
  } catch (error) {
    console.error('✗ Failed to get queue items:', error);
    return [];
  }
}

/**
 * Update queue item status
 */
export function updateQueueItemStatus(queueItemId, status, error = null) {
  try {
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (error) {
      const item = findWhere('syncQueue', { id: queueItemId })[0];
      updateData.retryCount = (item?.retryCount || 0) + 1;
      updateData.lastError = typeof error === 'string' ? error : error.message;
    }

    update('syncQueue', queueItemId, updateData);
    console.log(`✓ Queue item ${queueItemId} marked as ${status}`);
  } catch (error) {
    console.error(`✗ Failed to update queue item ${queueItemId}:`, error);
  }
}

/**
 * Remove a synced item from queue
 */
export function removeFromQueue(queueItemId) {
  try {
    deleteRecord('syncQueue', queueItemId);
    console.log('✓ Removed from queue:', queueItemId);
  } catch (error) {
    console.error('✗ Failed to remove from queue:', error);
  }
}

/**
 * Get queue statistics
 */
export function getQueueStats() {
  try {
    const all = findAll('syncQueue');
    const pending = findWhere('syncQueue', { status: 'pending' });
    const syncing = findWhere('syncQueue', { status: 'syncing' });
    const failed = findWhere('syncQueue', { status: 'failed' });

    return {
      total: all.length,
      pending: pending.length,
      syncing: syncing.length,
      failed: failed.length,
    };
  } catch (error) {
    console.error('✗ Failed to get queue stats:', error);
    return { total: 0, pending: 0, syncing: 0, failed: 0 };
  }
}

/**
 * Clear the entire queue (use with caution!)
 */
export function clearQueue() {
  try {
    findAll('syncQueue').forEach(item => {
      deleteRecord('syncQueue', item.id);
    });
    console.log('✓ Queue cleared');
  } catch (error) {
    console.error('✗ Failed to clear queue:', error);
  }
}

/**
 * Retry failed items (re-queue them)
 */
export function retryFailedItems() {
  try {
    const failedItems = findWhere('syncQueue', { status: 'failed' });
    failedItems.forEach(item => {
      if (item.retryCount < 3) {
        // Max 3 retries
        updateQueueItemStatus(item.id, 'pending');
      }
    });
    console.log(`✓ Retried ${failedItems.length} failed items`);
    return failedItems.length;
  } catch (error) {
    console.error('✗ Failed to retry items:', error);
    return 0;
  }
}

/**
 * Set sync metadata (e.g., last sync time)
 */
export function setSyncMetadata(key, value) {
  try {
    // Check if metadata exists
    const existing = findWhere('syncMetadata', { key });

    if (existing.length > 0) {
      update('syncMetadata', key, {
        value: typeof value === 'string' ? value : JSON.stringify(value),
        updatedAt: new Date().toISOString(),
      });
    } else {
      insert('syncMetadata', {
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error(`✗ Failed to set metadata ${key}:`, error);
  }
}

/**
 * Get sync metadata
 */
export function getSyncMetadata(key) {
  try {
    const result = findWhere('syncMetadata', { key });
    if (result.length > 0) {
      try {
        return JSON.parse(result[0].value);
      } catch {
        return result[0].value;
      }
    }
    return null;
  } catch (error) {
    console.error(`✗ Failed to get metadata ${key}:`, error);
    return null;
  }
}
