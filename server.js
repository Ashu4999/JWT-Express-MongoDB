const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const { logger } = require('./middleware/logEvents');
const { errHandler } = require('./middleware/errHandler');
const cors = require('cors');
const { corsOptions } = require("./config/cors");

app.use(logger);

// CORS = Cross Origin Resourse Sharing.
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data for e.g form-data
// 'contect-type : application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files from public folder
app.use("/", express.static(path.join(__dirname, 'public')));
app.use("/subdir", express.static(path.join(__dirname, 'public')));

app.use('/', require("./routes/root"));
app.use('/subdir', require("./routes/subdir"));
app.use('/route-chain', require("./routes/routeChain"));
app.use('/employees', require("./routes/employees"));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("text").send("404 Not Found");
    }
});

app.use(errHandler);

app.listen(PORT, (req, res) => {
    console.log(`server is running on port : ${PORT}`);
});