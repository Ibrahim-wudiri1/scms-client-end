/**
 * Request Queue Manager
 * Handles queueing of API requests when offline
 */

import { addToSyncQueue } from './syncQueue';
import { insert, findWhere } from '../db/dbManager';

/**
 * Queue a failed request to retry when online
 */
export async function queueRequest(config) {
  const { method, url, data, shopId, tenantId } = config;

  // Determine entity type and operation from URL
  let entityType = 'UNKNOWN';
  let operationType = 'READ';

  if (url.includes('/sales')) {
    entityType = 'SALE';
    operationType = method === 'POST' ? 'CREATE' : method === 'PUT' ? 'UPDATE' : 'READ';
  } else if (url.includes('/inventory')) {
    entityType = 'INVENTORY';
    operationType = method === 'POST' ? 'CREATE' : method === 'PUT' ? 'UPDATE' : 'READ';
  } else if (url.includes('/products')) {
    entityType = 'PRODUCT';
    operationType = method === 'POST' ? 'CREATE' : method === 'PUT' ? 'UPDATE' : 'READ';
  } else if (url.includes('/customers')) {
    entityType = 'CUSTOMER';
    operationType = method === 'POST' ? 'CREATE' : method === 'PUT' ? 'UPDATE' : 'READ';
  }

  // Priority based on entity type
  let priority = 3; // Default: low priority
  if (entityType === 'SALE') priority = 1; // High: sales are revenue
  if (entityType === 'INVENTORY') priority = 2; // Medium-high: inventory affects sales

  try {
    const queuedRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      method,
      url,
      data: typeof data === 'string' ? data : JSON.stringify(data),
      config: JSON.stringify({
        headers: config.headers,
        params: config.params,
      }),
      entityType,
      operationType,
      shopId,
      tenantId,
      priority,
      retryCount: 0,
      createdAt: new Date().toISOString(),
      status: 'pending', // 'pending', 'syncing', 'synced', 'failed'
    };

    // Store in a separate request queue table (we'll add this to DB schema)
    // For now, use syncQueue with special handling
    await addToSyncQueue(operationType, entityType, queuedRequest.id, queuedRequest, priority);

    console.log(`✓ Queued ${method} ${url} for retry`);
    return queuedRequest.id;
  } catch (error) {
    console.error('✗ Failed to queue request:', error);
    throw error;
  }
}

/**
 * Get all queued requests ready for sync
 */
export function getQueuedRequests() {
  try {
    // Fetch from syncQueue table
    const queued = findWhere('syncQueue', {
      status: 'pending',
    });

    return queued.filter(item => ['CREATE', 'UPDATE', 'DELETE'].includes(item.operationType));
  } catch (error) {
    console.error('✗ Failed to get queued requests:', error);
    return [];
  }
}

/**
 * Process a single queued request (retry)
 */
export async function processQueuedRequest(queueItem, axiosInstance) {
  try {
    const payload = typeof queueItem.payload === 'string'
      ? JSON.parse(queueItem.payload)
      : queueItem.payload;

    const { method, url, data } = payload;

    // Make the request
    const response = await axiosInstance({
      method,
      url,
      data: data ? JSON.parse(data) : undefined,
    });

    return {
      success: true,
      response,
      queueItemId: queueItem.id,
    };
  } catch (error) {
    return {
      success: false,
      error,
      queueItemId: queueItem.id,
    };
  }
}

/**
 * Check if a request is queued (for deduplication)
 */
export function isRequestQueued(method, url) {
  try {
    const queued = getQueuedRequests();
    return queued.some(item => {
      try {
        const payload = typeof item.payload === 'string'
          ? JSON.parse(item.payload)
          : item.payload;
        return payload.method === method && payload.url === url;
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error('✗ Failed to check if request queued:', error);
    return false;
  }
}

/**
 * Get queue size (count of pending requests)
 */
export function getQueueSize() {
  try {
    return getQueuedRequests().length;
  } catch (error) {
    console.error('✗ Failed to get queue size:', error);
    return 0;
  }
}

/**
 * Create a request config for queuing
 */
export function createQueueableConfig(method, url, data = null, config = {}) {
  return {
    method,
    url,
    data,
    headers: config.headers || {},
    params: config.params || {},
    shopId: config.shopId,
    tenantId: config.tenantId,
  };
}
