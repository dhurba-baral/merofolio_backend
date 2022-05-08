const mongoose = require('mongoose');
const fetch = require('node-fetch');


const watchlistSchema = new mongoose.Schema({
    nameOfCompany: {
        type: String,
        required: true
    },
    targetPrice:{
        type:Number,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
module.exports = Watchlist;



