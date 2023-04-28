const express = require('express');
const router = express.Router();
const path = require('path');

let rootDirectoryPath = path.join(__dirname, "..");

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(rootDirectoryPath, 'views', 'subdir', 'index.html'));
});

router.get('/test(.html)?', (req, res) => {
    res.sendFile(path.join(rootDirectoryPath, 'views', 'subdir', 'test.html'));
});

module.exports = router;
