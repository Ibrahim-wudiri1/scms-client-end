/**
 * SQLite Database Initialization
 * Mirrors the Prisma schema for offline-first support
 */

import initSqlJs from 'wa-sqlite/dist/wa-sqlite.mjs';
import { Factory } from 'wa-sqlite';
import wasmUrl from 'wa-sqlite/dist/wa-sqlite.wasm?url';
import { setSqlite3 } from './dbManager';

let db = null;
let sqlite3 = null;

/**
 * Initialize SQLite database with offline schema
 */
export async function initializeDatabase() {
  if (db) return db;

  try {
    // Initialize wa-sqlite module with explicit wasm URL
    const Module = await initSqlJs({
      locateFile: () => wasmUrl
    });

    
    // Create SQLite API
    sqlite3 = Factory(Module);
    
    // Set sqlite3 instance for dbManager
    setSqlite3(sqlite3);
    
    // Create database connection
    db = await sqlite3.open_v2(':memory:');
    
    // Create tables mirroring Prisma schema
    await createTables();

    console.log('✓ SQLite database initialized');
    return db;
  } catch (error) {
    console.error('✗ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Create all required tables for offline support
 */
async function createTables() {
  const schema = `
    -- Products table
    CREATE TABLE IF NOT EXISTS products (
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
    );

    -- Inventory tracking
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      shopId TEXT NOT NULL,
      tenantId TEXT NOT NULL,
      currentQty INTEGER DEFAULT 0,
      lastUpdated TEXT,
      FOREIGN KEY(productId) REFERENCES products(id)
    );

    -- Customers
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      tenantId TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT UNIQUE,
      loyaltyPoints INTEGER DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT
    );

    -- Sales (Point of Sale transactions)
    CREATE TABLE IF NOT EXISTS sales (
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
    );

    -- Sale line items
    CREATE TABLE IF NOT EXISTS saleItems (
      id TEXT PRIMARY KEY,
      saleId TEXT NOT NULL,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      lineTotal REAL,
      FOREIGN KEY(saleId) REFERENCES sales(id),
      FOREIGN KEY(productId) REFERENCES products(id)
    );

    -- Stock movements (Audit trail)
    CREATE TABLE IF NOT EXISTS stockMovements (
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
    );

    -- Sync queue (stores pending operations)
    CREATE TABLE IF NOT EXISTS syncQueue (
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
    );

    -- Sync metadata
    CREATE TABLE IF NOT EXISTS syncMetadata (
      key TEXT PRIMARY KEY,
      value TEXT,
      updatedAt TEXT
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_products_shopId ON products(shopId);
    CREATE INDEX IF NOT EXISTS idx_products_tenantId ON products(tenantId);
    CREATE INDEX IF NOT EXISTS idx_inventory_productId ON inventory(productId);
    CREATE INDEX IF NOT EXISTS idx_inventory_shopId ON inventory(shopId);
    CREATE INDEX IF NOT EXISTS idx_sales_shopId ON sales(shopId);
    CREATE INDEX IF NOT EXISTS idx_sales_tenantId ON sales(tenantId);
    CREATE INDEX IF NOT EXISTS idx_sales_offlineId ON sales(offlineId);
    CREATE INDEX IF NOT EXISTS idx_saleItems_saleId ON saleItems(saleId);
    CREATE INDEX IF NOT EXISTS idx_saleItems_productId ON saleItems(productId);
    CREATE INDEX IF NOT EXISTS idx_stockMovements_productId ON stockMovements(productId);
    CREATE INDEX IF NOT EXISTS idx_syncQueue_status ON syncQueue(status);
    CREATE INDEX IF NOT EXISTS idx_syncQueue_priority ON syncQueue(priority);
  `;

  // Execute schema creation
  const statements = schema.split(';').filter(s => s.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      sqlite3.exec(db, statement);
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
    await sqlite3.close(db);
    db = null;
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

  for (const table of tables) {
    sqlite3.exec(db, `DELETE FROM ${table}`);
  }

  console.log('✓ Database cleared');
}

export function exportDatabaseData() {
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

  for (const table of tables) {
    const stmt = sqlite3.prepare(db, `SELECT * FROM ${table}`);
    const rows = [];
    
    while (sqlite3.step(stmt) === sqlite3.SQLITE_ROW) {
      const row = {};
      for (let i = 0; i < sqlite3.column_count(stmt); i++) {
        const name = sqlite3.column_name(stmt, i);
        row[name] = sqlite3.column(stmt, i);
      }
      rows.push(row);
    }
    
    sqlite3.finalize(stmt);
    result[table] = rows;
  }

  return result;
}
