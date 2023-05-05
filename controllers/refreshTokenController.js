const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const refreshTokenController = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt)
        return res.sendStatus(403);

    //getting refresh token from cookies
    let refreshToken = cookies?.jwt;

    //getting user by comparing refresh token
    let foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser)
        return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            //throwing err if token username and DB token username not matched
            if (err || decoded.username != foundUser.username)
                return res.sendStatus(403);

            const roles = Object.values(foundUser.roles).filter(Boolean);//User's roles
            //creating new token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        username: decoded.username,
                        roles: roles,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15s" }
            );

            return res.status(201).json({ message: "Access token created", accessToken, roles })
        });
};

module.exports = { refreshTokenController };