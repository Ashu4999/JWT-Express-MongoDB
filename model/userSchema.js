const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: {
        User: { type: Number, default: 3 },
        Admin: Number,
        Editor: Number,
    },
    refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);