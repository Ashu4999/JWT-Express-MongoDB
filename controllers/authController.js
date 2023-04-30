const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "please provide username and password." });
        }

        const foundUser = await User.findOne({ username }).exec();

        if (!foundUser) {
            return res.status(409).json({ message: "No user found." })
        }

        let checkPwdMatch = await bcrypt.compare(password, foundUser.password);

        if (!checkPwdMatch) {
            return res.status(401).json({ message: "Invalid Crendentials" });
        }

        const roles = Object.values(foundUser.roles);//User's roles

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    username: foundUser.username,
                    roles: roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        //saving refresh token in users DB .
        // await User.findByIdAndUpdate(foundUser._id, { refreshToken: refreshToken }).exec();
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: `${username} logged in!!!`, accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogin };



