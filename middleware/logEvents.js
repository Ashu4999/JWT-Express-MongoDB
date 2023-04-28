const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

let logsFolderLocation = path.join(__dirname, '..');
const logEvents = async (message, fileName) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(logsFolderLocation, 'logs'))) {
            await fsPromises.mkdir(path.join(logsFolderLocation, 'logs'));
        }

        await fsPromises.appendFile(path.join(logsFolderLocation, 'logs', fileName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = async (req, res, next) => {
    try {
        let logContent = `${req.method} \t ${req.headers.origin} \t ${req.path}`;
        logEvents(logContent, 'request-log.txt');
        next();
    } catch (error) {
        console.log(error);
        res.end("Something went wrong");
    }
}

module.exports = { logger, logEvents };
