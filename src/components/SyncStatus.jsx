/**
 * Sync Status Component
 * Displays online/offline status, queue count, and sync progress
 */

import React, { useEffect, useState } from 'react';
import { useOfflineStore } from '../store/offlineStore';
import { Wifi, WifiOff, Clock, AlertCircle } from 'lucide-react';

export function SyncStatus() {
  const {
    isOnline,
    queueStats,
    queueDetails,
    lastSyncTime,
    isSyncing,
    syncProgress,
    syncError,
    refreshQueueStats,
  } = useOfflineStore();

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Refresh queue stats periodically
    const interval = setInterval(() => {
      refreshQueueStats();
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [refreshQueueStats]);

  if (isOnline && queueStats.total === 0 && !isSyncing) {
    // Everything is synced, show minimal indicator
    return (
      <div className="px-4 py-2 bg-green-50 border-b border-green-200 text-sm flex items-center gap-2">
        <Wifi className="w-4 h-4 text-green-600" />
        <span className="text-green-700">Connected</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200 text-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}

          <span className={isOnline ? 'text-green-700' : 'text-red-700'}>
            {isOnline ? 'Connected' : 'Offline'}
          </span>

          {queueStats.total > 0 && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-yellow-700 font-medium">
                {queueStats.total} pending
              </span>
            </>
          )}

          {isSyncing && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-blue-700">
                Syncing {syncProgress.current}/{syncProgress.total}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {syncError && (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          {isSyncing && (
            <div className="animate-spin">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          )}
        </div>
      </div>

      {/* Details section */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-yellow-200 space-y-2">
          {/* Queue breakdown */}
          {queueStats.total > 0 && (
            <div className="space-y-1 text-xs">
              {queueStats.pending > 0 && (
                <div className="flex justify-between">
                  <span className="text-yellow-700">Pending:</span>
                  <span className="font-medium">{queueStats.pending}</span>
                </div>
              )}
              {queueStats.syncing > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Syncing:</span>
                  <span className="font-medium">{queueStats.syncing}</span>
                </div>
              )}
              {queueStats.failed > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-700">Failed:</span>
                  <span className="font-medium">{queueStats.failed}</span>
                </div>
              )}
            </div>
          )}

          {/* Sync progress bar */}
          {isSyncing && syncProgress.total > 0 && (
            <div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${syncProgress.percent}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {syncProgress.percent}% complete
              </div>
            </div>
          )}

          {/* Last sync time */}
          {lastSyncTime && (
            <div className="text-xs text-gray-600">
              Last sync: {new Date(lastSyncTime).toLocaleTimeString()}
            </div>
          )}

          {/* Error message */}
          {syncError && (
            <div className="text-xs text-red-700 bg-red-50 p-2 rounded">
              {syncError}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {isOnline && queueStats.total > 0 && (
              <button
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('offline:reconnected'));
                }}
              >
                Sync Now
              </button>
            )}
            {queueStats.failed > 0 && (
              <button
                className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('offline:retryFailed'));
                }}
              >
                Retry Failed
              </button>
            )}
          </div>
          {queueDetails.length > 0 && (
            <div className="mt-3 text-xs text-gray-700 bg-white p-3 rounded border border-gray-200">
              <div className="font-semibold mb-2">Queue details</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {queueDetails.map((detail) => (
                  <div key={`${detail.entityType}-${detail.status}`} className="rounded bg-gray-50 p-2">
                    <div className="font-medium">{detail.entityType}</div>
                    <div className="text-gray-500">{detail.status}</div>
                    <div className="text-right font-semibold">{detail.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SyncStatus;
