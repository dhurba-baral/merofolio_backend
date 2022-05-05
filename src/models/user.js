const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const Question = require('./question')
const Stock = require('../models/stocks');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:true,
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
    graphdata:{
        date:[],
        totalProfit:[],
    },
},
{
        timestamps:true
    })

//get date and totalProfit of everyday
userSchema.methods.getDateAndProfit=async function(){

    const user=this;
    const stock = await Stock.find({createdBy:user._id});

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date();
    const month = date.getMonth();
    const monthName = monthNames[month];
    const day = date.getDate();


    if(stock.length!=0){
        //for date
        user.graphdata.date=user.graphdata.date.concat(`${monthName} ${day}`);
        await user.save();
        console.log('Date updated.')

        //for totalProfit
        let totalProfit=0;
        for(let i=0;i<stock.length;i++){
        totalProfit+=stock[i].profit;
        }
        user.graphdata.totalProfit=user.graphdata.totalProfit.concat(totalProfit);
        await user.save();
        console.log('Total profit updated.')
    }
}

//delete the first element of date and totalProfit if the length of date and totalProfit is more than 7
userSchema.methods.deleteDateAndProfit=async function(){
    const user=this;
    if(user.graphdata.date!=0){
    if(user.graphdata.date.length>7){
        user.graphdata.date.shift();
        await user.save();
        console.log('Date deleted.')
    }
}
    if(user.graphdata.totalProfit!=0){
    if(user.graphdata.totalProfit.length>7){
        user.graphdata.totalProfit.shift();
        await user.save();
        console.log('Total profit deleted.')
    }
}
}



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
