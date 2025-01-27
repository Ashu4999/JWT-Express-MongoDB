const allowedOrigins = process.env.allowedOrigins;

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) != -1) {
        res.header("Access-Control-Allow-Credentials", true);
    }
    next();
};

module.exports = credentials;

