const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },

    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true
    },
    expirydate:{ 
        type: Number,
        required: true
    },
})

const otp = mongoose.model('Otp', otpSchema)
module.exports = otp