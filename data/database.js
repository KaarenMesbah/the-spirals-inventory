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
        date TEXT NOT NULL,
        total INTEGER
    )
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS bob (
    name TEXT,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER NOT NULL,
    count INTEGER NOT NULL,
    purchase_id INTEGER NOT NULL,
    category TEXT,

    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (purchase_id) REFERENCES purchase(id)
)
`).run();

module.exports = db;