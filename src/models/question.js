const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    }
}
    , {
        timestamps:true
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;