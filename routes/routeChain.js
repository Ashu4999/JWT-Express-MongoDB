const express = require("express");
const router = express.Router();

router.get('/hello-world', (req, res, next) => {
    console.log('In hello world');
    next();
}, (req, res) => {
    res.send("route chaining example");
});

const one = (req, res, next) => {
    console.log("In one");
    next();
};

const two = (req, res, next) => {
    console.log("In two");
    next();
};

const three = (req, res) => {
    console.log("In three");
    res.send("route chaining example");
};

//route-handler-chaining example
router.get('/chain-example', [one, two, three]);

module.exports = router;