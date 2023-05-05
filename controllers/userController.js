const User = require("../model/userSchema");

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().exec();

        return res.status(200).json({ data: allUsers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ messsage: error.toString() })
    }
};

module.exports = { getAllUsers };