const express = require("express");
const router = express.Router();
const path = require("path");

let rootDirectoryPath = path.join(__dirname, "..");

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(rootDirectoryPath, 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(rootDirectoryPath, 'views', 'new-page.html'));
});

router.get('/old-page.html', (req, res) => {
    res.redirect(301, '/new-page.html');
});

module.exports = router;