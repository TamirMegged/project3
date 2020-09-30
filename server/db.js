const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "flyaway",
    insecureAuth: true
})

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("db connected");
    }
})

const Query = (q, params) => {
    return new Promise((resolve, reject) => {
        db.query(q, params, (err, results) => {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(results);
            }
        })
    })
}

module.exports = Query;