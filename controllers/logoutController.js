const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");
let rootProjectPath = path.join(__dirname, "..");

const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data },
}

const handleLogout = async (req, res) => {
    //Delete Access-Token in client application.
    const cookies = req.cookies;

    if (!cookies?.jwt)
        return res.sendStatus(204);

    let refreshToken = cookies?.jwt;
    const foundUser = userDB.users.find(item => item.refreshToken == refreshToken);


    //if user not found with same token then delete jwt cookie.
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }

    //if user found then delete both jwt cookie and DB token
    let foundUserIndex = userDB.users.findIndex(item => item.refreshToken == refreshToken);
    userDB.users[foundUserIndex] = { ...userDB.users[foundUserIndex], refreshToken: "" }
    await fsPromises.writeFile(path.join(rootProjectPath, "model", "users.json"), JSON.stringify(userDB.users));
    console.log(userDB.users)
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); //secure :true - serve on https
    return res.json({ messgae: "user logout successfully" })
};

module.exports = { handleLogout };