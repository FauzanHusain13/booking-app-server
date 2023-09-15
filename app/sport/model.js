const mongoose = require("mongoose");

let sportSchema = mongoose.Schema({
    nameSport: {
        type: String,
        require: [true, "name sport is required!"]
    },
}, { timestamps : true })
 
module.exports = mongoose.model("Sport", sportSchema);