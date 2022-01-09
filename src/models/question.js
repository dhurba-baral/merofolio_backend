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

//virtual field to get the replies by the question
questionSchema.virtual('replies', {
    ref: 'Reply',
    localField: '_id',
    foreignField: 'question'
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;