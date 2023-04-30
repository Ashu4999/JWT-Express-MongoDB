const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4500;
const path = require('path');
const { logger } = require('./middleware/logEvents');
const { errHandler } = require('./middleware/errHandler');
const cors = require('cors');
const { corsOptions } = require("./config/cors");
const { verifyJWT } = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//connecting to mongoDB
connectDB();

app.use(logger);

//Handle options credentials check - before CORS!
//and fetch cookies credentials requirement.
app.use(credentials);

// CORS = Cross Origin Resourse Sharing.
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data for e.g form-data
// 'contect-type : application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies reading
app.use(cookieParser());

// serve static files from public folder
app.use("/", express.static(path.join(__dirname, 'public')));
app.use("/subdir", express.static(path.join(__dirname, 'public')));

app.use('/', require("./routes/root"));
app.use('/subdir', require("./routes/subdir"));
app.use('/route-chain', require("./routes/routeChain"));
app.use('/register', require("./routes/register"));
app.use('/auth', require("./routes/auth"));
app.use('/refresh', require("./routes/refresh"))
app.use('/logout', require("./routes/logout"));

app.use(verifyJWT);
app.use('/employees', require("./routes/api/employees"));

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

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    //listening requests only after connected to mongoDB
    app.listen(PORT, (req, res) => {
        console.log(`server is running on port : ${PORT}`);
    });
});
