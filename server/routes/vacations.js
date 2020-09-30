const router = require('express').Router()
const { verifyAdmin, verifyUser } = require('../verify')
const Query = require("../db")

// Get all vacations - GET /
router.get('/', async (req, res) => {
    try {
        let q = `SELECT * FROM vacations`;
        let vacations = await Query(q);
        res.json(vacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

// Get one vacation - GET /:id
router.get('/:id', async (req, res) => {
    try {
        let q = `SELECT * FROM vacations WHERE id = ?`;
        let vacation = await Query(q, [req.params.id]);
        res.json(vacation);
    } catch (err) {
        res.sendStatus(500);
    }
})

// Add a vacation - POST /add (admin only)
router.post('/add', async (req, res) => {
    const { image, destination, start_date, end_date, description, price } = req.body;
    if (image && destination && start_date && end_date && description && price) {
        let q = `INSERT INTO vacations (image, destination, start_date, end_date, description, price)
        VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            await Query(q, [image, destination, start_date, end_date, description, price]);
            let vacations = await Query(`SELECT * FROM vacations`);
            res.json(vacations);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.status(400).json({ error: true, msg: "Missing info" });
    }
})

// Initial database creation call - POST /createdatabase
router.post('/createdatabase', async (req, res) => {
    const vacations = req.body;
    vacations.map(async (vacation) => {
        const { image, destination, start_date, end_date, description, price } = vacation;
        if (image && destination && start_date && end_date && description && price) {
            let q = `INSERT INTO vacations (image, destination, start_date, end_date, description, price)
            VALUES (?, ?, ?, ?, ?, ?)`;
            try {
                await Query(q, [image, destination, start_date, end_date, description, price]);
                let vacations = await Query(`SELECT * FROM vacations`);
                res.json(vacations);
            } catch (error) {
                res.sendStatus(500);
            }
        } else {
            res.status(400).json({ error: true, msg: "Missing info" });
        }
    })
})

// edit a vacation - PUT /:id (admin only)
router.put('/:id', async (req, res) => {
    const { image, destination, start_date, end_date, description, price } = req.body;
    try {
        let q = `UPDATE vacations SET image = ?, destination = ?, start_date = ?, 
        end_date = ?, description = ?, price = ?
        WHERE id = ?`;
        await Query(q, [image, destination, start_date, end_date, description, price, req.params.id]);
        let vacations = await Query(`SELECT * FROM vacations`);
        res.json(vacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

// delete a avcation - /:id (admin only)
router.delete('/:id', async (req, res) => {
    try {
        let q = `DELETE FROM vacations WHERE id = ?`;
        await Query(q, [req.params.id]);
        let vacations = await Query(`SELECT * FROM vacations`);
        res.json(vacations);
    } catch (err) {
        res.sendStatus(500);
    }
})

module.exports = router;