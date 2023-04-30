const bcrypt = require("bcrypt");
const path = require("path");
const fsPromises = require("fs").promises;
let rootProjectPath = path.join(__dirname, "..");
const Roles_List = require("../config/roles");

const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data },
};

const handleRegister = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "please provide username and password." })
    }

    const checkUserExists = userDB.users.find(item => item.username == username);

    if (checkUserExists) {
        return res.status(409).json({ message: "Username already exists." });;
    }

    try {
        const hashedPwd = await bcrypt.hash(password, 10);

        const newUser = { username, password: hashedPwd, roles: { User: Roles_List.User } };
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(path.join(rootProjectPath, "model", "users.json"), JSON.stringify(userDB.users));

        res.status(201).json({ message: `New user created ${username}` });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = { handleRegister };

