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
    res.status(201).send(user.toObject());
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;