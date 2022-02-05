const express = require('express');
const router = new express.Router();
const Stock = require('../models/stocks');
const auth = require('../authentication/auth');

//post a stock
router.post('/stocks',auth,async(req, res) => {
    const stock = new Stock({
        ...req.body,
        createdBy: req.user._id
    });
    try {
        await stock.save();
        res.status(201).send(stock);
    } catch (error) {
        res.status(400).send(error);
    }
})

//get all the stocks created by the user
router.get('/stocks',auth,async(req, res) => {
    try {
        const stocks = await Stock.find({createdBy: req.user._id});
        res.send(stocks);
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router;