const express = require('express');
const cors = require('cors');
const db = require('./db');
const port = 1000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", require('./routes/users'));
app.use("/vacations",require('./routes/vacations'));

app.get("/", (req, res) => {
    res.send("Hello old friend");
})

app.listen(port, () => console.log(`up and running on ${port}`));