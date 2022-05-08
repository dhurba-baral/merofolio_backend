const express = require('express');
const router = new express.Router();
const Reply = require('../models/reply');
const Question = require('../models/question');
const auth = require('../authentication/auth');

router.post('/discussionForum/reply/:id', auth,async (req, res) => {
    const reply = new Reply({
        ...req.body,
        createdBy: req.user._id,
        question: req.params.id
    });
    try {
        await reply.save();
        res.status(201).send(reply);
    } catch (error) {
        res.status(400).send(error);
    }
})

//to get all the replies by the question id
router.get('/discussionForum/reply/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).send({
                errorMessage: 'Question by the id not found'
            });
        }
        await question.populate('replies');
        if(question.replies.length === 0){
            return res.status(404).send({
                errorMessage: 'No replies found'
            });
        }
        res.status(200).send(question.replies);
    } catch (error) {
        res.status(400).send(error);
    }
})

//get a reply by the id
router.get('/reply/:id', async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);
        if (!reply) {
            return res.status(404).send({
                errorMessage: 'Reply by the id not found'
            });
        }
        res.status(200).send(reply);
    } catch (error) {
        res.status(400).send(error);
    }
})

//update the reply by the id
router.patch('/discussionForum/reply/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['text'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({
            errorMessage: 'Invalid updates!'
        });
    }
    try {
        const reply = await Reply.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!reply) {
            return res.status(404).send({
                errorMessage: 'Reply not found'
            });
        }
        updates.forEach((update) => reply[update] = req.body[update]);
        await reply.save();
        res.status(200).send(reply);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/discussionForum/reply/:id', auth, async (req, res) => {
    try {
        const reply = await Reply.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!reply) {
            return res.status(404).send({
                errorMessage: 'Reply not found'
            });
        }
        res.status(200).send(reply);
    } catch (error) {
        res.status(400).send(error);
    }

    })
module.exports = router;