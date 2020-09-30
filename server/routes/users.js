const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const Query = require('../db');
const e = require('express');

//Register
router.post("/register", async (req, res) => {
    try {
        let { first_name, last_name, username, password, role } = req.body;
        if (first_name && last_name && username && password) {
            if (!role) {
                role = "user";
            }
            let user = await Query(`SELECT * FROM users WHERE username = ?`, username);
            if (!user.length) {
                const salt = genSaltSync();
                const hash = hashSync(password, salt);
                let q = `INSERT INTO users (first_name, last_name, username, password, role)
                VALUES (?, ?, ?, ?, ?)`;
                await Query(q, [first_name, last_name, username, hash, role]);
                res.status(201).json({ error: false, msg: "New user added successfully", hash });
            } else {
                res.status(400).json({ error: true, msg: "Username already taken" });
            }
        } else {
            res.status(400).json({ error: true, msg: "Missing info" });
        }
    } catch (err) {
        res.sendStatus(500);
    }
})

//Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {
            let q = `SELECT * FROM users WHERE username = ?`;
            let user = await Query(q, [username]);
            if (user.length) {
                if (compareSync(password, user[0].password)) {
                    const { id, first_name, last_name, role } = user[0];
                    let access_token = jwt.sign({ id, first_name, last_name, role }, "kingTamir", {
                        expiresIn: "10m"
                    });
                    let refresh_token = jwt.sign({ id }, "refresh", {
                        expiresIn: "7d"
                    });
                    res.status(200).json({ error: false, msg: "Logged In", access_token, refresh_token, id, password: user[0].password });
                } else {
                    res.status(401).json({ error: false, msg: "Wrong password" });
                }
            } else {
                res.status(401).json({ error: false, msg: "User not found" });
            }
        } catch (err) {
            res.sendStatus(500);
        }
    } else {
        res.status(400).json({ error: true, msg: "Missing info" });
    }
})

//Refresh
router.post('/refresh', (req, res) => {
    const { token } = req.body;
    jwt.verify(token, "refresh", (err, user) => {
        if (err) {
            res.sendStatus(401);
        } else {
            let currentUser = users[user.id - 1];
            if (currentUser.refresh === token) {
                const { id, first_name, last_name, role } = currentUser;
                let access_token = jwt.sign({ id, first_name, last_name, role }, "kingTamir", {
                    expiresIn: "10m"
                });
                res.res.json({ error: false, access_token });
            } else {
                res.sendStatus(403);
            }
        }
    })
})


// Logout
router.get('/logout/:id', (req, res) => {
    delete users[req.params.id - 1].refresh;
})

module.exports = router;