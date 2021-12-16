const express = require('express');
const router =new express.Router();
const User=require('../models/user');

router.post('/user/signup', async(req, res) => {
    const user=new User(req.body);
    try {
        const checkEmail=await User.findOne({email:req.body.email});
        if(checkEmail){
            res.status(400).send({errorMessage:'Email already exists'});
        }
    
    await user.save();

    //to hide the private data
    const publicProfile = user.toObject();
    delete publicProfile.password;

    res.status(201).send(publicProfile);
    
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/user/login', async(req, res) => {
    try {
        const user=await User.findOne({email:req.body.email, password:req.body.password});
        if(!user){
            res.status(401).send({errorMessage:'Invalid Login'});
        }

        //hide the private data
        const publicProfile = user.toObject();
        delete publicProfile.password;

        res.status(200).send(publicProfile);
    } catch (error) {
        res.status(400).send(error);
    }
})


module.exports = router;