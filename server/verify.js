const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    if (req.header("Authorization")) {
        jwt.verify(req.header("Authorization"), "kingTamir", (err, user) => {
            if (err) {
                res.status(403).json({ error: true, msg: "Token invalid" });
            } else {
                req.user = user;
                next();
            }
        })
    } else {
        res.status(401).json({ error: true, msg: "Token expected" });
    }
}

const verifyAdmin = (req, res, next) => {
    if (req.header("Authorization")) {
        jwt.verify(req.header("Authorization"), "kingTamir", (err, user) => {
            if (err) {
                res.status(403).json({ error: true, msg: "Token invalid" });
            } else {
                if (user.role === "admin") {
                    req.user = user;
                    next();
                } else {
                    res.status(403).json({ error: true, msg: "Not an admin" });
                }
            }
        });
    } else {
        res.status(401).json({ error: true, msg: "Token expected" })
    }
}

module.exports = { verifyAdmin, verifyUser };