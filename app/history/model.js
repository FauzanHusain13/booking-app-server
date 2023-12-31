const mongoose = require("mongoose");

let historySchema = mongoose.Schema({
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field"
    },
    package: {
       hour: { type: Number },
       price: { type: Number } 
    },
    payment: {
        paymentName: { type: String },
        noRek: { type: Number },
        noTelp: { type: Number }
    },
    when: {
        type: String,
        default: "today"
    },
    startTime: {
        type: Number,
        require: [true, "start time is required!"]
    },
    endTime: {
        type: Number,
        require: [true, "end time is required!"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tax: {
        type: Number
    },
    total: {
        type: Number
    }
}, { timestamps : true })

module.exports = mongoose.model("History", historySchema);