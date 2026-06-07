/**
 * SQLite Database Store
 * Centralized database instance management (no circular dependencies)
 */

let db = null;

export function setDatabase(database) {
  db = database;
  console.log('Database instance set:', !!db);
}

export function getDatabase() {
  return db;
}
