/**
 * SQLite Database Manager
 * Generic CRUD operations for offline database
 */

import { getDatabase } from './dbInit';

// Get sqlite3 instance (assuming it's initialized)
let sqlite3 = null;

export function setSqlite3(instance) {
  sqlite3 = instance;
}

/**
 * Generate a unique ID (for entities without server-generated IDs yet)
 */
export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function insert(table, data) {
  const db = getDatabase();
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => '?').join(',');

  const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;

  try {
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, values);
    sqlite3.step(stmt);
    sqlite3.finalize(stmt);
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
  const db = getDatabase();
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
  const db = getDatabase();
  const columns = Object.keys(data);
  const values = [...Object.values(data), id];
  const setClause = columns.map(col => `${col} = ?`).join(',');

  const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;

  try {
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, values);
    sqlite3.step(stmt);
    sqlite3.finalize(stmt);
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
  const db = getDatabase();
  const query = `SELECT * FROM ${table} WHERE id = ?`;

  try {
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, [id]);
    
    if (sqlite3.step(stmt) === sqlite3.SQLITE_ROW) {
      const row = {};
      for (let i = 0; i < sqlite3.column_count(stmt); i++) {
        const name = sqlite3.column_name(stmt, i);
        row[name] = sqlite3.column(stmt, i);
      }
      sqlite3.finalize(stmt);
      return row;
    }
    
    sqlite3.finalize(stmt);
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
  const db = getDatabase();
  let query = `SELECT * FROM ${table}`;

  if (limit) {
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  try {
    const stmt = sqlite3.prepare(db, query);
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
  const db = getDatabase();
  const whereClause = Object.keys(conditions)
    .map(key => `${key} = ?`)
    .join(' AND ');
  const values = Object.values(conditions);

  let query = `SELECT * FROM ${table} WHERE ${whereClause}`;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  try {
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, values);
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
  const db = getDatabase();
  const query = `DELETE FROM ${table} WHERE id = ?`;

  try {
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, [id]);
    sqlite3.step(stmt);
    sqlite3.finalize(stmt);
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
  const db = getDatabase();
  const whereClause = Object.keys(conditions)
    .map(key => `${key} = ?`)
    .join(' AND ');
  const values = Object.values(conditions);

  const query = `DELETE FROM ${table} WHERE ${whereClause}`;

  try {
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, values);
    sqlite3.step(stmt);
    sqlite3.finalize(stmt);
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
  const db = getDatabase();
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
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, values);
    
    if (sqlite3.step(stmt) === sqlite3.SQLITE_ROW) {
      const result = sqlite3.column(stmt, 0);
      sqlite3.finalize(stmt);
      return result;
    }
    
    sqlite3.finalize(stmt);
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
  const db = getDatabase();
  
  try {
    const stmt = sqlite3.prepare(db, query);
    sqlite3.bind_collection(stmt, params);
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
export function beginTransaction() {
  const db = getDatabase();
  sqlite3.exec(db, 'BEGIN TRANSACTION');
}

/**
 * Commit a transaction
 */
export function commit() {
  const db = getDatabase();
  sqlite3.exec(db, 'COMMIT');
}

/**
 * Rollback a transaction
 */
export function rollback() {
  const db = getDatabase();
  sqlite3.exec(db, 'ROLLBACK');
}

/**
 * Execute operations within a transaction
 */
export async function transaction(callback) {
  try {
    beginTransaction();
    const result = await callback();
    commit();
    return result;
  } catch (error) {
    rollback();
    throw error;
  }
}
