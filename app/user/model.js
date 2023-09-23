const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const HASH_ROUND = 10;

let userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, "username is required!"]
    },
    email: {
        type: String,
        require: [true, "email is required!"]
    },
    password: {
        type: String,
        require: [true, "password is required!"]
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        require: [true, "location is required!"]
    },
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
        require: [true, "sport is required!"]
    },
    professional: {
        type: Boolean,
        default: false
    },
    nik: {
        type: Number
    }
}, { timestamps : true })

userSchema.path("username").validate(async function(value) {
    try {
        const count = await this.model("User").countDocuments({ username: value })
        return !count
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} is already!`)

userSchema.pre("save", function(next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})
 
module.exports = mongoose.model("User", userSchema);