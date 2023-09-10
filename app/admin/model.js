const mongoose = require("mongoose");

let adminSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, "email is required!"]
    },
    password: {
        type: String,
        require: [true, "password is required!"]
    },
}, { timestamps : true })

module.exports = mongoose.model("Admin", adminSchema);