const { logEvents } = require('./logEvents');

const errHandler = function (err, req, res, next) {
    console.error(err.message, req.header.origin);
    logEvents(`${req.method}\t${req.headers.origin}\t${err.message}`, "error-log.txt");
    res.status(500).send(err.message);
};

module.exports = { errHandler };