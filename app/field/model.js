const mongoose = require("mongoose");

let packageSchema = mongoose.Schema({
    hour: {
        type: Number,
        require: [true, "hours per price is required!"]
    },
    price: {
        type: Number,
        require: [true, "price per hour is required!"]
    }
})

let paymentSchema = mongoose.Schema({
    paymentName: {
        type: String,
        require: [true, "payment name is required!"]
    },
    noRek: {
        type: Number,
    },
    noTelp: {
        type: Number,
    }
})

let fieldSchema = mongoose.Schema({
    nameField: {
        type: String, 
        require: [true, "field name is required!"]
    },
    imageField: {
        type: String, 
        require: [true, "image field is required!"]
    },
    nameSport: {
        type: String,
        require: [true, "sport name is required!"]
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    desc: {
        type: String,
        require: [true, "description is required!"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    open: {
        type: Number,
        require: [true, "open schedule is required!"]
    },
    closed: {
        type: Number,
        require: [true, "close schedule is required!"]
    },
    packages: [packageSchema],
    payments: [paymentSchema]
}, { timestamps : true })

module.exports = mongoose.model("Field", fieldSchema);