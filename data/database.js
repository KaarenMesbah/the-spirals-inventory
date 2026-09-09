const Database = require("better-sqlite3");

const db = new Database("./data/database.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER,
        count INTEGER,
        category TEXT
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS purchase (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS bob (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id TEXT NOT NULL,
        price INTEGER,
        purchase_id INTEGER,
        category TEXT
    )
`).run();

module.exports = db;