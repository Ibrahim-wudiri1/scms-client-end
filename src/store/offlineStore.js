/**
 * Zustand Store for Offline State Management
 * Manages: online/offline status, sync queue, metadata
 */

import { create } from 'zustand';
import { findAll, findWhere, update as updateDb, insert, deleteWhere } from '../lib/db/dbManager';

export const useOfflineStore = create((set, get) => ({
  // Online/Offline status
  isOnline: navigator.onLine,

  // Sync queue metadata
  queueStats: {
    total: 0,
    pending: 0,
    failed: 0,
    syncing: 0,
  },
  queueDetails: [],

  // Last sync timestamp
  lastSyncTime: null,

  // Sync in progress
  isSyncing: false,

  // Current sync progress
  syncProgress: {
    current: 0,
    total: 0,
    percent: 0,
  },

  // Conflicts requiring user attention
  conflicts: [],

  // Sync errors
  syncError: null,

  /**
   * Set online/offline status
   */
  setOnlineStatus: (isOnline) => {
    set({ isOnline });
    if (isOnline) {
      // Trigger sync when reconnected
      get().autoSync();
    }
  },

  /**
   * Update queue statistics
   */
  updateQueueStats: (stats) => {
    set({ queueStats: stats });
  },

  /**
   * Add item to sync queue
   */
  addToQueue: async (operationType, entityType, entityId, payload, priority = 3) => {
    const queueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operationType,
      entityType,
      entityId,
      payload: JSON.stringify(payload),
      priority,
      retryCount: 0,
      lastError: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
    };

    try {
      insert('syncQueue', queueItem);
      get().refreshQueueStats();
    } catch (error) {
      console.error('Failed to add to queue:', error);
    }
  },

  /**
   * Start syncing
   */
  startSync: () => {
    set({
      isSyncing: true,
      syncError: null,
      syncProgress: { current: 0, total: 0, percent: 0 },
    });
  },

  /**
   * Update sync progress
   */
  updateSyncProgress: (current, total) => {
    set({
      syncProgress: {
        current,
        total,
        percent: total > 0 ? Math.round((current / total) * 100) : 0,
      },
    });
  },

  /**
   * Complete sync
   */
  completeSync: () => {
    set({
      isSyncing: false,
      lastSyncTime: new Date().toISOString(),
      syncError: null,
    });
    get().refreshQueueStats();
  },

  /**
   * Set sync error
   */
  setSyncError: (error) => {
    set({
      isSyncing: false,
      syncError: error,
    });
  },

  /**
   * Add conflict
   */
  addConflict: (conflict) => {
    set((state) => ({
      conflicts: [...state.conflicts, conflict],
    }));
  },

  /**
   * Remove conflict
   */
  removeConflict: (conflictId) => {
    set((state) => ({
      conflicts: state.conflicts.filter(c => c.id !== conflictId),
    }));
  },

  /**
   * Clear all conflicts
   */
  clearConflicts: () => {
    set({ conflicts: [] });
  },

  /**
   * Refresh queue statistics from database
   */
  refreshQueueStats: async () => {
    try {
      const pending = findWhere('syncQueue', { status: 'pending' }).length;
      const failed = findWhere('syncQueue', { status: 'failed' }).length;
      const syncing = findWhere('syncQueue', { status: 'syncing' }).length;
      const all = findAll('syncQueue');

      const queueDetailsMap = all.reduce((acc, item) => {
        const key = `${item.entityType}:${item.status}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const queueDetails = Object.entries(queueDetailsMap).map(([key, count]) => {
        const [entityType, status] = key.split(':');
        return { entityType, status, count };
      });

      set({
        queueStats: {
          total: pending + failed + syncing,
          pending,
          failed,
          syncing,
        },
        queueDetails,
      });
    } catch (error) {
      if (error?.message?.includes('Database not initialized')) {
        set({
          queueStats: {
            total: 0,
            pending: 0,
            failed: 0,
            syncing: 0,
          },
          queueDetails: [],
        });
        return;
      }

      console.error('Failed to refresh queue stats:', error);
    }
  },

  /**
   * Get queue items by priority
   */
  getQueueByPriority: () => {
    try {
      // Priority 1 (sales), then Priority 2 (inventory), then Priority 3 (others)
      const sales = findWhere('syncQueue', {
        status: 'pending',
        priority: 1,
      });
      const inventory = findWhere('syncQueue', {
        status: 'pending',
        priority: 2,
      });
      const others = findWhere('syncQueue', {
        status: 'pending',
        priority: 3,
      });

      return [...sales, ...inventory, ...others];
    } catch (error) {
      console.error('Failed to get queue by priority:', error);
      return [];
    }
  },

  /**
   * Mark queue item as syncing
   */
  markSyncing: (queueItemId) => {
    try {
      updateDb('syncQueue', queueItemId, {
        status: 'syncing',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to mark as syncing:', error);
    }
  },

  /**
   * Mark queue item as synced
   */
  markSynced: (queueItemId) => {
    try {
      deleteWhere('syncQueue', { id: queueItemId });
    } catch (error) {
      console.error('Failed to mark as synced:', error);
    }
  },

  /**
   * Mark queue item as failed
   */
  markFailed: (queueItemId, error) => {
    try {
      updateDb('syncQueue', queueItemId, {
        status: 'failed',
        lastError: error.message || String(error),
        retryCount: (findWhere('syncQueue', { id: queueItemId })[0]?.retryCount || 0) + 1,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to mark as failed:', err);
    }
  },

  /**
   * Clear queue
   */
  clearQueue: () => {
    try {
      deleteWhere('syncQueue', {});
      get().refreshQueueStats();
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  },

  /**
   * Auto-sync when online (called on reconnection)
   */
  autoSync: () => {
    const state = get();
    if (state.isOnline && !state.isSyncing && state.queueStats.total > 0) {
      // Trigger sync - will be handled by sync engine
      // Dispatch custom event that sync engine listens to
      window.dispatchEvent(new CustomEvent('offline:reconnected'));
    }
  },
}));

/**
 * Initialize offline store - setup window events
 */
export function initializeOfflineStore() {
  const store = useOfflineStore.getState();

  // Listen to online/offline events
  window.addEventListener('online', () => {
    store.setOnlineStatus(true);
  });

  window.addEventListener('offline', () => {
    store.setOnlineStatus(false);
  });

  // Initial status check
  store.refreshQueueStats();
}
