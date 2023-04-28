let whiteListOfOrigins = ["https://yoursite.com", "https://www.google.com"];

let corsOptions = {
    origin: (origin, callback) => {
        if (whiteListOfOrigins.indexOf(origin) != -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by cors"), false);
        }
    },
    optionsSuccessStatus: 200
};

module.exports = { corsOptions };