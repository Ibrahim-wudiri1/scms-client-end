/**
 * SQLite Database Manager
 * Generic CRUD operations for offline database
 */

import { getDatabase } from './dbStore';

// Get database instance
let db = null;

export function setDatabase(database) {
  db = database;
  console.log('Database instance set:', !!db);
}

function ensureDbReady() {
  if (!db) {
    throw new Error('SQLite database not initialized. Call initializeDatabase() first.');
  }
}

/**
 * Generate a unique ID (for entities without server-generated IDs yet)
 */
export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function insert(table, data) {
  ensureDbReady();
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => '?').join(',');

  const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;

  try {
    const stmt = db.prepare(query);
    stmt.bind(values);
    stmt.step();
    stmt.free();
    return { success: true, id: data.id };
  } catch (error) {
    console.error(`✗ Insert into ${table} failed:`, error);
    throw error;
  }
}

/**
 * Batch insert records
 */
export function insertBatch(table, records) {
  ensureDbReady();
  let successCount = 0;
  let failureCount = 0;
  const errors = [];

  for (const record of records) {
    try {
      insert(table, record);
      successCount++;
    } catch (error) {
      failureCount++;
      errors.push({ record, error: error.message });
    }
  }

  return { successCount, failureCount, errors };
}

/**
 * Update a record
 */
export function update(table, id, data) {
  ensureDbReady();
  const columns = Object.keys(data);
  const values = [...Object.values(data), id];
  const setClause = columns.map(col => `${col} = ?`).join(',');

  const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;

  try {
    const stmt = db.prepare(query);
    stmt.bind(values);
    stmt.step();
    stmt.free();
    return { success: true };
  } catch (error) {
    console.error(`✗ Update in ${table} failed:`, error);
    throw error;
  }
}

/**
 * Get a single record by ID
 */
export function findById(table, id) {
  ensureDbReady();
  const query = `SELECT * FROM ${table} WHERE id = ?`;

  try {
    const stmt = db.prepare(query);
    stmt.bind([id]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    
    stmt.free();
    return null;
  } catch (error) {
    console.error(`✗ Find in ${table} failed:`, error);
    throw error;
  }
}

/**
 * Get all records from a table
 */
export function findAll(table, limit = null, offset = 0) {
  ensureDbReady();
  let query = `SELECT * FROM ${table}`;

  if (limit) {
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  try {
    const stmt = db.prepare(query);
    const rows = [];
    
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    
    stmt.free();
    return rows;
  } catch (error) {
    console.error(`✗ FindAll in ${table} failed:`, error);
    throw error;
  }
}

/**
 * Find records matching a condition
 */
export function findWhere(table, conditions, limit = null) {
  ensureDbReady();
  const whereClause = Object.keys(conditions)
    .map(key => `${key} = ?`)
    .join(' AND ');
  const values = Object.values(conditions);

  let query = `SELECT * FROM ${table} WHERE ${whereClause}`;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  try {
    const stmt = db.prepare(query);
    stmt.bind(values);
    const rows = [];
    
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    
    stmt.free();
    return rows;
  } catch (error) {
    console.error(`✗ FindWhere in ${table} failed:`, error);
    throw error;
  }
}

/**
 * Delete a record
 */
export function deleteRecord(table, id) {
  ensureDbReady();
  const query = `DELETE FROM ${table} WHERE id = ?`;

  try {
    const stmt = db.prepare(query);
    stmt.bind([id]);
    stmt.step();
    stmt.free();
    return { success: true };
  } catch (error) {
    console.error(`✗ Delete from ${table} failed:`, error);
    throw error;
  }
}

/**
 * Delete records matching a condition
 */
export function deleteWhere(table, conditions) {
  ensureDbReady();
  const whereClause = Object.keys(conditions)
    .map(key => `${key} = ?`)
    .join(' AND ');
  const values = Object.values(conditions);

  const query = `DELETE FROM ${table} WHERE ${whereClause}`;

  try {
    const stmt = db.prepare(query);
    stmt.bind(values);
    stmt.step();
    stmt.free();
    return { success: true };
  } catch (error) {
    console.error(`✗ DeleteWhere from ${table} failed:`, error);
    throw error;
  }
}

/**
 * Count records matching a condition
 */
export function count(table, conditions = null) {
  ensureDbReady();
  let query = `SELECT COUNT(*) as count FROM ${table}`;
  let values = [];

  if (conditions) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    query += ` WHERE ${whereClause}`;
    values = Object.values(conditions);
  }

  try {
    const stmt = db.prepare(query);
    stmt.bind(values);
    
    if (stmt.step()) {
      const result = stmt.get()[0];
      stmt.free();
      return result || 0;
    }
    
    stmt.free();
    return 0;
  } catch (error) {
    console.error(`✗ Count in ${table} failed:`, error);
    throw error;
  }
}

/**
 * Execute a custom SQL query
 */
export function execute(query, params = []) {
  ensureDbReady();
  
  try {
    const stmt = db.prepare(query);
    stmt.bind(params);
    const rows = [];
    
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    
    stmt.free();
    return rows;
  } catch (error) {
    console.error('✗ Custom query execution failed:', error);
    throw error;
  }
}

/**
 * Convert database row to object
 */
function rowToObject(columns, row) {
  const obj = {};
  columns.forEach((col, index) => {
    obj[col] = row[index];
  });
  return obj;
}

/**
 * Get database statistics
 */
export function getStats() {
  ensureDbReady();
  const tables = [
    'products',
    'inventory',
    'customers',
    'sales',
    'saleItems',
    'stockMovements',
    'syncQueue'
  ];

  const stats = {};
  for (const table of tables) {
    stats[table] = count(table);
  }

  return stats;
}

/**
 * Start a transaction (for batch operations)
 */
export async function beginTransaction() {
  ensureDbReady();
  try {
    await db.run('BEGIN TRANSACTION');
  } catch (error) {
    console.error('Error beginning transaction:', error);
  }
}

/**
 * Commit a transaction
 */
export async function commit() {
  ensureDbReady();
  try {
    await db.run('COMMIT');
  } catch (error) {
    console.error('Error committing transaction:', error);
  }
}

/**
 * Rollback a transaction
 */
export async function rollback() {
  ensureDbReady();
  try {
    await db.run('ROLLBACK');
  } catch (error) {
    console.error('Error rolling back transaction:', error);
  }
}

/**
 * Execute operations within a transaction
 */
export async function transaction(callback) {
  try {
    await beginTransaction();
    const result = await callback();
    await commit();
    return result;
  } catch (error) {
    await rollback();
    throw error;
  }
}
