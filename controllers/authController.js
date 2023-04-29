const bcrypt = require("bcrypt");

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

        res.status(200).json({ message: `${username} logged in!!!` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleLogin };



