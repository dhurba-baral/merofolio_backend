const express = require('express');
const router =new express.Router();
const User=require('../models/user');
const auth=require('../authentication/auth');
const bcrypt=require('bcryptjs');
const Stock=require('../models/stocks');
const Question = require('../models/question');
const Reply = require('../models/reply');
const Watchlist = require('../models/watchlist');

router.post('/user/signup', async(req, res) => {
    const user=new User(req.body);
    try {
        const checkEmail=await User.findOne({email:req.body.email});
        if(checkEmail){
            res.status(400).send({errorMessage:'Email already exists'});
        }
    
    await user.save();

    const token=await user.generateAuthToken();


    //to hide the private data
    const publicProfile = user.toObject();
    delete publicProfile.password;
    // delete publicProfile.tokens;

    res.status(201).send({publicProfile, token});
    
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/user/login', async(req, res) => {
    try {
        const findUserByEmail=await User.findOne({email:req.body.email});
        if(!findUserByEmail){
            res.status(401).send({errorMessage:'Wrong Email.'});
        }else{
            const compared=await bcrypt.compare(req.body.password, findUserByEmail.password);
            if(!compared){
                res.status(401).send({errorMessage:'Wrong Password.'});
            }else{
        const token=await findUserByEmail.generateAuthToken();

        //hide the private data
        const publicProfile = findUserByEmail.toObject();
        delete publicProfile.password;
        //delete publicProfile.tokens;

        res.status(200).send({publicProfile, token});
            }
        }
    } catch (error) {
        res.status(400).send(error);
    }

})

//get all users
router.get('/user/all',async(req,res)=>{
    try{
        const users=await User.find({});
        res.status(200).send(users);
    }catch(error){
        res.status(400).send(error);
    }
})

//get user by id
router.get('/user/:id',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        res.status(200).send(user);
    }catch(error){
        res.status(400).send(error);
    }
})

//get details of logged in user
router.get('/user/me',auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user._id);
        res.status(200).send(user);
    }catch(error){
        res.status(400).send(error);
    }
})

router.post('/user/logout', auth, async(req, res) => {
    try {
        const user=req.user;
        const tokenOfUser = req.token;
        user.tokens=user.tokens.filter((token)=>{
            return token.token!==tokenOfUser;  //to remove the token from the tokens array
        })
        await user.save();
        res.status(200).send({message:'Logged out successfully'});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/user/update', auth, async(req, res) => {
    const user=req.user;
    const updates=Object.keys(req.body);
    try{
        updates.forEach((update)=>{
            user[update]=req.body[update];
        })
        await user.save();

        //to hide the private data
        const publicProfile = user.toObject();
        delete publicProfile.password;
        delete publicProfile.tokens;

        res.status(200).send(publicProfile);
    }catch(error){
        res.status(400).send(error);
    }
})

router.delete('/user/delete', auth, async(req, res) => {
    try {
        const user=req.user;
        const deletedUser = await User.findByIdAndDelete(user._id);
        //delete all stocks of user if user is deleted
        await Stock.deleteMany({createdBy:user._id});


        //find all questions by the user
        const questions=await Question.find({createdBy:user._id});
        // console.log(questions);

        questions.forEach(async(question)=>{
            await Reply.deleteMany({question:question._id})
        })
        
        //delete all the questions of user if user is deleted
        await Question.deleteMany({createdBy:user._id});
        


        //delete all the replies if the user is deleted
        await Reply.deleteMany({createdBy:user._id});

        //delete the watchlist of the user
        await Watchlist.deleteMany({createdBy:user._id});

        res.status(200).send({user:deletedUser,message:'User deleted successfully'});
    
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;