const express = require("express");
const path = require("path");
const db = require("./data/database");
const generateItemsPdf = require('./data/itemsPdf');

const app = express();
const PORT = 5756;


app.use(express.json());
app.use(express.static(path.join(__dirname, "front")));

app.post("/add", (req, res) => {
    console.log(req.body);

    const { name, price, count, category } = req.body;

    const result = db.prepare(`
        INSERT INTO items (name, price, count, category)
        VALUES (?, ?, ?, ?)
    `).run(name, price, count, category);

    res.json({ success: result.changes > 0, id: result.lastInsertRowid });
});

app.get('/items/pdf', (req, res) => {
    try {
        const items = db.prepare(`
            SELECT id, name, price, count, category
            FROM items
            ORDER BY id
        `).all();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="items.pdf"'
        );

        generateItemsPdf(items, res);

    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            res.status(500).send('Failed to generate PDF');
        }
    }
});

app.get("/items", (req, res) => {
    const items = db.prepare(`
        SELECT * FROM items
    `).all();

    res.json(items);
});

app.get("/del/:id", (req, res) => {
    const id = req.params.id;

    const result = db.prepare(`
        DELETE FROM items WHERE id = ?
    `).run(id);

    res.json({
        success: result.changes > 0
    });
});

app.put("/items/:id", (req, res) => {
    const id = req.params.id;
    const { name, price, count, category } = req.body;

    const result = db.prepare(`
        UPDATE items
        SET name = ?, price = ?, count = ?, category = ?
        WHERE id = ?
    `).run(name, price, count, category, id);

    res.json({
        success: result.changes > 0
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
