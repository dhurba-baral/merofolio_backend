const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({ 
    stockname: {
        type:String,
        required:true,
        trim: true,
    },
    stockprice:{
        type:Number,
        requires:true
    },
    email: {
        type:String,
        required:true,
        trim: true,
        lowercase: true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    }
}
    , {
        timestamps:true
}
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;