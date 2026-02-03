import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, '../../data/btc_metrics.db');

// Initialize database
export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      last_login TEXT
    )
  `);

  // User sessions table (for tracking active sessions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // User preferences table (for future features)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      theme TEXT DEFAULT 'dark',
      notifications_enabled INTEGER DEFAULT 1,
      preferred_currency TEXT DEFAULT 'USD',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database initialized at:', DB_PATH);
}

// Initialize tables first (before creating prepared statements)
initializeDatabase();

// User queries
export const userQueries = {
  create: db.prepare(`
    INSERT INTO users (id, email, password, name, created_at)
    VALUES (?, ?, ?, ?, ?)
  `),

  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ? COLLATE NOCASE
  `),

  findById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),

  updateLastLogin: db.prepare(`
    UPDATE users SET last_login = ? WHERE id = ?
  `),

  getAll: db.prepare(`
    SELECT id, email, name, created_at, last_login FROM users
  `),

  delete: db.prepare(`
    DELETE FROM users WHERE id = ?
  `)
};

// Session queries
export const sessionQueries = {
  create: db.prepare(`
    INSERT INTO sessions (id, user_id, token, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `),

  findByToken: db.prepare(`
    SELECT * FROM sessions WHERE token = ? AND datetime(expires_at) > datetime('now')
  `),

  deleteByUserId: db.prepare(`
    DELETE FROM sessions WHERE user_id = ?
  `),

  deleteExpired: db.prepare(`
    DELETE FROM sessions WHERE datetime(expires_at) <= datetime('now')
  `)
};

// Preference queries
export const preferenceQueries = {
  create: db.prepare(`
    INSERT INTO user_preferences (user_id, theme, notifications_enabled, preferred_currency)
    VALUES (?, ?, ?, ?)
  `),

  findByUserId: db.prepare(`
    SELECT * FROM user_preferences WHERE user_id = ?
  `),

  update: db.prepare(`
    UPDATE user_preferences 
    SET theme = ?, notifications_enabled = ?, preferred_currency = ?
    WHERE user_id = ?
  `)
};

// Cleanup old sessions periodically
export function startSessionCleanup() {
  // Clean up expired sessions every hour
  setInterval(() => {
    const result = sessionQueries.deleteExpired.run();
    if (result.changes > 0) {
      console.log(`🧹 Cleaned up ${result.changes} expired sessions`);
    }
  }, 60 * 60 * 1000); // Every hour
}

// Graceful shutdown
export function closeDatabase() {
  db.close();
  console.log('📦 Database connection closed');
}

// Export database instance
export default db;
