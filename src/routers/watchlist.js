const express = require('express');
const router = new express.Router();
const Watchlist = require('../models/watchlist');
const auth = require('../authentication/auth');

//create watchlist
router.post('/watchlist',auth,async(req, res) => {
    const watchlist = new Watchlist({
        ...req.body, 
        createdBy: req.user._id});
    try {
        await watchlist.save();
        res.status(201).send(watchlist);
    } catch (error) {
        res.status(400).send(error);
    }
});

//get all the watchlists by the user
router.get('/watchlist',auth,async(req, res) => {
    try {
        const watchlist = await Watchlist.find({createdBy: req.user._id});
        res.send(watchlist);
    } catch (error) {
        res.status(500).send();
    }
});



//delete a watchlist by the id
router.delete('/watchlist/:id',auth,async(req, res) => {
    try {
        const watchlist = await Watchlist.findOneAndDelete({_id: req.params.id,createdBy: req.user._id});
        if(!watchlist){
            return res.status(404).send({
                errorMessage: 'Watchlist not found'
            });
        }
        res.status(200).send(watchlist);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;



