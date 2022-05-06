const express = require('express');
const router =new express.Router();
const auth = require('../authentication/auth');
const TargetProfit = require('../models/profit');

//set target profit (remove if and add if already exists)
router.post('/targetProfit',auth, async(req, res) => {
    const targetProfit=new TargetProfit({
        ...req.body,
        createdBy:req.user._id});  //to get the user id
    try {
        //find the targetProfit with the same createdBy
        const targetProfitExist=await TargetProfit.findOne({createdBy:req.user._id});
        if(targetProfitExist){
            await targetProfitExist.remove();
        }
        await targetProfit.save();
        res.status(201).send(targetProfit);
    } catch (error) {
        res.status(400).send(error);
    }
})

//get target profit
router.get('/targetProfit',auth,async(req, res) => {
    //find the target profit by the authenticated user
    const userId=req.user._id;
    try {
        const targetProfit=await TargetProfit.findOne({createdBy:userId});
        res.status(200).send(targetProfit);
    } catch (error) {
        res.status(400).send(error);
    }
})

//delete the target profit
router.delete('/targetProfit',auth,async(req, res) => {
    const userId=req.user._id;
    try {
        const targetProfit=await TargetProfit.findOne({createdBy:userId});
        if(!targetProfit){
            return res.status(404).send({errorMessage:'No target profit found'});
        }
        await targetProfit.remove();
        res.status(200).send(targetProfit);
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;

