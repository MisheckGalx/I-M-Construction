const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../data/isiah.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'admin',
    createdAt TEXT DEFAULT (datetime('now'))
  );
`);

console.log('✅  SQLite database ready');
module.exports = db;
