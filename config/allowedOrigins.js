const os = require('os');

// const networkInterfaces = os.networkInterfaces();
// const ipv4Interfaces =
//     networkInterfaces['Ethernet']
//         ? networkInterfaces['Ethernet'].filter(interface => interface.family === 'IPv4')
//         : networkInterfaces['Wi-Fi'].filter(interface => interface.family === 'IPv4');

// const ipAddress = ipv4Interfaces[0].address;

let allowedOrigins = [
    "https://yoursite.com",
    "https://www.google.com",
    "http://localhost:3000",
    // `http://${ipAddress}:3000`,
];

module.exports = allowedOrigins;