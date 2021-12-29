const express = require('express');
const router =new express.Router();
const User=require('../models/user');
const auth=require('../authentication/auth');
const bcrypt=require('bcryptjs');

router.post('/user/signup', async(req, res) => {
    const user=new User(req.body);
    try {
        const checkEmail=await User.findOne({email:req.body.email});
        if(checkEmail){
            res.status(400).send({errorMessage:'Email already exists'});
        }
    
    await user.save();

    await user.generateAuthToken();


    //to hide the private data
    const publicProfile = user.toObject();
    delete publicProfile.password;
    // delete publicProfile.tokens;

    res.status(201).send(publicProfile);
    
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
        await findUserByEmail.generateAuthToken();

        //hide the private data
        const publicProfile = findUserByEmail.toObject();
        delete publicProfile.password;
        //delete publicProfile.tokens;

        res.status(200).send(publicProfile);
            }
        }
    } catch (error) {
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

module.exports = router;