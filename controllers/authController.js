const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");
let rootProjectPath = path.join(__dirname, "..");

const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.data = data },
};

const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "please provide username and password." });
        }

        const foundUser = userDB.users.find(item => item.username == username);

        if (!foundUser) {
            return res.status(409).json({ message: "No user found." })
        }

        let checkPwdMatch = await bcrypt.compare(password, foundUser.password);

        if (!checkPwdMatch) {
            return res.status(401).json({ message: "Invalid Crendentials" });
        }

        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        //saving refresh token with current token.
        let foundUserIndex = userDB.users.findIndex(item => item.username == foundUser.username);
        userDB.users[foundUserIndex] = { ...foundUser, refreshToken: refreshToken };
        await fsPromises.writeFile(path.join(rootProjectPath, "model", "users.json"), JSON.stringify(userDB.users));

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: `${username} logged in!!!`, accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogin };



