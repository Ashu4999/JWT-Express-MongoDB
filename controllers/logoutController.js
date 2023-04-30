const User = require("../model/userSchema");

const handleLogout = async (req, res) => {
    //Delete Access-Token in client application.
    const cookies = req.cookies;

    if (!cookies?.jwt)
        return res.sendStatus(204);

    let refreshToken = cookies?.jwt;

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    //if user not found with same token then delete jwt cookie.
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }

    //if user found then delete both jwt cookie and DB token
    await User.findByIdAndUpdate(foundUser._id, { refreshToken: "" }).exec();

    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); //secure :true - serve on https
    return res.json({ messgae: "user logout successfully" })
};

module.exports = { handleLogout };