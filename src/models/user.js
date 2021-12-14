const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim: true,
        minlength: 3,
    },
    email: {
        type:String,
        required:true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }

    },
    password: {
        type:String,
        trim: true,
        required:true,
        minlength: 5,
    }
    
})

//to convert the schema into a model
const User = mongoose.model('User', userSchema);

module.exports = User;
