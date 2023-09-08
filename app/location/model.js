const mongoose = require("mongoose");

let locationSchema = mongoose.Schema({
    province: {
        type: String,
        require: [true, "province is required!"]
    },
    city: {
        type: String,
        require: [true, "city is required!"]
    }
}, { timestamps : true })

module.exports = mongoose.model("Location", locationSchema);