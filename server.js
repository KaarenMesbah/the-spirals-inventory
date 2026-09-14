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

app.get('/purchases/del/:id', (req, res) => {
    try {
        const purchaseId = req.params.id;

        const deletePurchase = db.transaction(() => {

            // Delete all items belonging to the purchase
            db.prepare(`
                DELETE FROM bob
                WHERE purchase_id = ?
            `).run(purchaseId);

            // Delete the purchase itself
            const result = db.prepare(`
                DELETE FROM purchase
                WHERE id = ?
            `).run(purchaseId);

            return result.changes;
        });

        const deleted = deletePurchase();

        if (deleted === 0) {
            return res.status(404).json({
                error: 'Purchase not found'
            });
        }

        res.json({
            success: true
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to delete purchase'
        });
    }
});

app.get('/purchases', (req, res) => {
    try {
        const purchases = db.prepare(`
            SELECT *
            FROM purchase
            ORDER BY id DESC
        `).all();

        res.json(purchases);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get purchases' });
    }
});

app.get('/purchases/:id', (req, res) => {
    try {
        const purchase = db.prepare(`
            SELECT *
            FROM purchase
            WHERE id = ?
        `).get(req.params.id);

        if (!purchase) {
            return res.status(404).json({
                error: 'Purchase not found'
            });
        }

        const items = db.prepare(`
            SELECT *
            FROM bob
            WHERE purchase_id = ?
        `).all(req.params.id);

        res.json({
            ...purchase,
            items
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to get purchase'
        });
    }
});

app.post('/purchases', (req, res) => {
    try {
        const { date, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                error: 'No items'
            });
        }

        const total = items.reduce((sum, item) => {
            return sum + (item.price * item.count);
        }, 0);

        const createPurchase = db.prepare(`
            INSERT INTO purchase (date, total)
            VALUES (?, ?)
        `);

        const createBob = db.prepare(`
            INSERT INTO bob (
                name,
                item_id,
                price,
                original_price,
                count,
                purchase_id,
                category
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction(() => {

            const purchase = createPurchase.run(date, total);

            for (const item of items) {
                createBob.run(
                    item.name,
                    item.item_id,
                    item.price,
                    item.original_price,
                    item.count,
                    purchase.lastInsertRowid,
                    item.category
                );
            }

            return purchase.lastInsertRowid;
        });

        const purchaseId = transaction();

        res.json({
            success: true,
            purchase_id: purchaseId,
            total
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to create purchase'
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
