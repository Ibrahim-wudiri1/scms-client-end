import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import {TenantProvider} from "./context/TenantContext";
import {AuthProvider} from "./context/AuthContext.jsx";
import {ShopProvider} from "./context/ShopContext.jsx";
import { OfflineSalesProvider } from './context/OfflineSalesContext';
import { initializeDatabase } from './lib/db/dbInit';
import { initializeOfflineStore } from './store/offlineStore';
import { setupSyncEventListeners } from './lib/offline/syncEngine';

// Initialize offline infrastructure
async function initializeApp() {
  try {
    // Initialize SQLite database
    await initializeDatabase();
    console.log('✓ Offline database initialized');

    // Initialize offline store
    initializeOfflineStore();
    console.log('✓ Offline store initialized');

    // Setup sync event listeners
    setupSyncEventListeners();
    console.log('✓ Sync engine initialized');

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✓ Service Worker registered:', registration);
        })
        .catch(error => {
          console.warn('✗ Service Worker registration failed:', error);
        });
    }
  } catch (error) {
    console.error('✗ Failed to initialize app:', error);
  }
}

// Initialize app before rendering
initializeApp().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
        <TenantProvider>
          <OfflineSalesProvider>
            {/* <ShopProvider> */}
              <App />
            {/* </ShopProvider> */}
          </OfflineSalesProvider>
        </TenantProvider>
    </StrictMode>,
  );
});
