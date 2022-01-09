const express = require('express');
const router =new express.Router();
const Question=require('../models/question');
const auth = require('../authentication/auth');

router.post('/discussionForum/question',auth, async(req, res) => {
    const question=new Question({
        ...req.body,
        createdBy:req.user._id});  //to get the user id
    try {
        await question.save();
        res.status(201).send(question);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/discussionForum/question', async(req, res) => {
    try {
        const question=await Question.find();
        if(!question){
            return res.status(404).send({errorMessage:'No question found'});
        }
        question.reverse()
        res.status(200).send(question);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/discussionForum/question/:id', async(req, res) => {
    const _id=req.params.id;
    try {
        const question=await Question.findById(_id);
        if (!question) {
            return res.status(404).send({
                errorMessage: 'Question not found'
            });
        }
        res.status(200).send(question);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/discussionForum/question/:id', auth, async(req, res) => {
    const updates=Object.keys(req.body);
    const allowedUpdates=['text'];
    const isValidOperation=updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({
            errorMessage: 'Invalid updates!'
        });
    }
    try {
        const question=await Question.findOne({_id:req.params.id,createdBy:req.user._id});
        if (!question) {
            return res.status(404).send({
                errorMessage: 'Question not found'
            });
        }
        updates.forEach((update) => question[update]=req.body[update]);
        await question.save();
        res.status(200).send(question);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/discussionForum/question/:id',auth, async(req, res)=>{
    try{
        const question=await Question.findOneAndDelete({_id:req.params.id,createdBy:req.user._id});
        if (!question) {
            return res.status(404).send({
                errorMessage: 'Question not found'
            });
        }
        res.status(200).send(question);
    }catch(error){
        res.status(400).send(error);
    }
})

module.exports = router;