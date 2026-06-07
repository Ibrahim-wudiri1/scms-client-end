/**
 * SQLite Database Initialization
 * Mirrors the Prisma schema for offline-first support
 */

import initSqlJs from 'wa-sqlite/dist/wa-sqlite.mjs';
import { open } from 'wa-sqlite';
import wasmUrl from 'wa-sqlite/dist/wa-sqlite.wasm?url';
import { setDatabase } from './dbManager';

let db = null;
let initPromise = null;

/**
 * Initialize SQLite database with offline schema
 */
export async function initializeDatabase() {
  // Return existing initialization if already in progress or complete
  if (initPromise) return initPromise;
  if (db) return db;

  initPromise = (async () => {
    try {
      console.log('Initializing wa-sqlite...');
      
      // Initialize wa-sqlite module with explicit wasm URL
      const SQL = await initSqlJs({
        locateFile: () => wasmUrl
      });

      console.log('wa-sqlite Module loaded');
      
      // Open in-memory database
      db = await open(':memory:', SQL);
      console.log('Database connection opened');
      
      // Set database instance for dbManager BEFORE creating tables
      setDatabase(db);
      
      // Create tables mirroring Prisma schema
      await createTables();

      console.log('✓ SQLite database initialized successfully');
      return db;
    } catch (error) {
      console.error('✗ Failed to initialize database:', error);
      initPromise = null; // Reset on error to allow retry
      db = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Create all required tables for offline support
 */
async function createTables() {
  if (!db) {
    throw new Error('Database not ready');
  }

  const tables = [
    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      shopId TEXT NOT NULL,
      tenantId TEXT NOT NULL,
      name TEXT NOT NULL,
      sku TEXT,
      category TEXT,
      costPrice REAL,
      sellingPrice REAL,
      quantity INTEGER DEFAULT 0,
      description TEXT,
      image TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      isArchived BOOLEAN DEFAULT 0,
      UNIQUE(shopId, sku)
    )`,

    // Inventory tracking
    `CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      shopId TEXT NOT NULL,
      tenantId TEXT NOT NULL,
      currentQty INTEGER DEFAULT 0,
      lastUpdated TEXT,
      FOREIGN KEY(productId) REFERENCES products(id)
    )`,

    // Customers
    `CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      tenantId TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT UNIQUE,
      loyaltyPoints INTEGER DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT
    )`,

    // Sales (Point of Sale transactions)
    `CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      offlineId TEXT UNIQUE,
      shopId TEXT NOT NULL,
      tenantId TEXT NOT NULL,
      userId TEXT,
      totalAmount REAL NOT NULL,
      paymentType TEXT NOT NULL,
      customerId TEXT,
      status TEXT DEFAULT 'pending',
      syncedAt TEXT,
      createdOffline BOOLEAN DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(customerId) REFERENCES customers(id)
    )`,

    // Sale line items
    `CREATE TABLE IF NOT EXISTS saleItems (
      id TEXT PRIMARY KEY,
      saleId TEXT NOT NULL,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      lineTotal REAL,
      FOREIGN KEY(saleId) REFERENCES sales(id),
      FOREIGN KEY(productId) REFERENCES products(id)
    )`,

    // Stock movements (Audit trail)
    `CREATE TABLE IF NOT EXISTS stockMovements (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      saleId TEXT,
      shopId TEXT NOT NULL,
      tenantId TEXT NOT NULL,
      type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      userId TEXT,
      notes TEXT,
      createdAt TEXT,
      FOREIGN KEY(productId) REFERENCES products(id),
      FOREIGN KEY(saleId) REFERENCES sales(id)
    )`,

    // Sync queue (stores pending operations)
    `CREATE TABLE IF NOT EXISTS syncQueue (
      id TEXT PRIMARY KEY,
      operationType TEXT NOT NULL,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      payload TEXT,
      priority INTEGER DEFAULT 3,
      retryCount INTEGER DEFAULT 0,
      lastError TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      status TEXT DEFAULT 'pending'
    )`,

    // Sync metadata
    `CREATE TABLE IF NOT EXISTS syncMetadata (
      key TEXT PRIMARY KEY,
      value TEXT,
      updatedAt TEXT
    )`,

    // Indexes
    'CREATE INDEX IF NOT EXISTS idx_products_shopId ON products(shopId)',
    'CREATE INDEX IF NOT EXISTS idx_products_tenantId ON products(tenantId)',
    'CREATE INDEX IF NOT EXISTS idx_inventory_productId ON inventory(productId)',
    'CREATE INDEX IF NOT EXISTS idx_inventory_shopId ON inventory(shopId)',
    'CREATE INDEX IF NOT EXISTS idx_sales_shopId ON sales(shopId)',
    'CREATE INDEX IF NOT EXISTS idx_sales_tenantId ON sales(tenantId)',
    'CREATE INDEX IF NOT EXISTS idx_sales_offlineId ON sales(offlineId)',
    'CREATE INDEX IF NOT EXISTS idx_saleItems_saleId ON saleItems(saleId)',
    'CREATE INDEX IF NOT EXISTS idx_saleItems_productId ON saleItems(productId)',
    'CREATE INDEX IF NOT EXISTS idx_stockMovements_productId ON stockMovements(productId)',
    'CREATE INDEX IF NOT EXISTS idx_syncQueue_status ON syncQueue(status)',
    'CREATE INDEX IF NOT EXISTS idx_syncQueue_priority ON syncQueue(priority)',
  ];

  // Execute each statement
  for (const sql of tables) {
    try {
      await db.run(sql);
      const desc = sql.split('\n')[0].trim().substring(0, 50);
      console.log('✓', desc);
    } catch (error) {
      // Silently ignore "table/index already exists" errors
      if (!error.message?.includes('already exists')) {
        console.warn('Warning creating table/index:', error.message?.substring(0, 100));
      }
    }
  }
}



/**
 * Get database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (db) {
    try {
      await db.close();
      db = null;
    } catch (error) {
      console.error('Error closing database:', error);
    }
  }
}

/**
 * Clear all data from database (for testing/logout)
 */
export async function clearDatabase() {
  if (!db) return;

  const tables = [
    'products',
    'inventory',
    'customers',
    'sales',
    'saleItems',
    'stockMovements',
    'syncQueue',
    'syncMetadata'
  ];

  try {
    for (const table of tables) {
      await db.run(`DELETE FROM ${table}`);
    }
    console.log('✓ Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

export async function exportDatabaseData() {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const result = {};
  const tables = [
    'products',
    'inventory',
    'customers',
    'sales',
    'saleItems',
    'stockMovements',
    'syncQueue',
    'syncMetadata'
  ];

  try {
    for (const table of tables) {
      const stmt = db.prepare(`SELECT * FROM ${table}`);
      const rows = [];
      
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      
      stmt.free();
      result[table] = rows;
    }
  } catch (error) {
    console.error('Error exporting database:', error);
  }

  return result;
}
