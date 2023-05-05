const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const Roles_List = require("../config/roles");

const handleRegister = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password." })
    }

    const checkUserExists = await User.findOne({ username }).exec();

    if (checkUserExists) {
        return res.status(409).json({ message: "Username already exists." });;
    }

    try {
        const hashedPwd = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPwd, });
        const result = await newUser.save();

        res.status(201).json({ message: `User created ${username}`, id: result._id });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = { handleRegister };

