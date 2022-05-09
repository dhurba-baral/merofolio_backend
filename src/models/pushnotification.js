// const mongoose = require('mongoose');

// const pushNotificationSchema = new mongoose.Schema({ 
//     endpoint: {
//         type:String,
//         required:true,
//         trim: true,
//     },
//     expirationTime: String,
//     keys: {
//         p256dh:String,
//         auth:String
//     },
//     createdBy:{
//         type:mongoose.Schema.Types.ObjectId,
//         required:true,
//         ref:'User',
//     }
// }
// );

// const pushNotification = mongoose.model('pushNotification', pushNotificationSchema);
// module.exports = pushNotification;