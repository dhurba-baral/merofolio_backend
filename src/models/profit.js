const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
    targetProfit:{
        type:Number,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
})

const TargetProfit = mongoose.model('TargetProfit', profitSchema);
module.exports = TargetProfit;