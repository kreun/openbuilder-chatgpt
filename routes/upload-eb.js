var express = require('express');
var router = express.Router();

const db = require("../eb-db/db.js")

router.post("/", function (req, res, next) {
    let data = req.body;
    console.log("/api/eb ", data.name)
    db.setAllData(data)
    res.json({ result: "api" })
});

module.exports = router;