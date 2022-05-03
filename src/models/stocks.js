const mongoose= require('mongoose');

const stockSchema = new mongoose.Schema({
    nameOfCompany: {
        type: String,
        required: true
    },
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
    close:{
        type:Number,
        required:true,
        default:0,
    },
    profit:{
        type:Number,
        required:true,
        default:0,
    },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;