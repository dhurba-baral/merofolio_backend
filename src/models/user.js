const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const Question = require('./question')

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
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    tokens: [{
        token: {
            type:String,
            required:true
        }
    }],
},{
        timestamps:true
    }
    
)

//virtual field of questions created by the user
userSchema.virtual('question', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'createdBy'
})

//to hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//function for returning the tokens
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//to convert the schema into a model
const User = mongoose.model('User', userSchema);

module.exports = User;
