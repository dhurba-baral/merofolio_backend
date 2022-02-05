const mongoose= require('mongoose');

const stockSchema = new mongoose.Schema({
    numberOfShares:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;