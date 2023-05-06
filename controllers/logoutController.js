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
        res.clearCookie("jwt",
            {
                httpOnly: true,
                // domain: process.env.REACT_PROJECT_DOMAIN, sameSite: 'None', secure: true, //for https and different domains
            });
        return res.sendStatus(204);
    }

    //if user found then delete both jwt cookie and DB token
    // await User.findByIdAndUpdate(foundUser._id, { refreshToken: "" }).exec();
    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", {
        httpOnly: true,
        // domain: process.env.REACT_PROJECT_DOMAIN, sameSite: 'None', secure: true, //for https and different domains
    }); //secure :true - serve on https
    return res.json({ messgae: "user logout successfully" })
};

module.exports = { handleLogout };