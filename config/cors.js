// const allowedOrigins = require("./allowedOrigins");
const allowedOrigins = process.env.allowedOrigins;

let corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) != -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by cors: ${origin}`), false);
        }
    },
    optionsSuccessStatus: 200
};

module.exports = { corsOptions };