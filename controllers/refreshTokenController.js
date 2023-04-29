const jwt = require("jsonwebtoken");

const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data },
}
const refreshTokenController = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt)
        return res.sendStatus(403);

    //getting refresh token from cookies
    let refreshToken = cookies?.jwt;

    //getting user by comparing refresh token
    let foundUser = userDB.users.find(item => item.refreshToken == refreshToken);

    if (!foundUser)
        return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            //thrwing err if token username and DB token username not matched
            if (err || decoded.username != foundUser.username)
                return res.sendStatus(403);

            //creating new token
            const accessToken = jwt.sign(
                { username: decoded.username, },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            );

            return res.status(201).json({ message: "Access token created", accessToken })
        });
};

module.exports = { refreshTokenController };