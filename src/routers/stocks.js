const express = require('express');
const fetch = require('node-fetch');
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

//update the stock by the id (nameOfCompany, numberOfShares, price)
router.patch('/stocks/:id',auth,async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['nameOfCompany','numberOfShares','price'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({
            errorMessage: 'Invalid updates!'
        });
    }
    try {
        const stock = await Stock.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!stock) {
            return res.status(404).send({
                errorMessage: 'Stock not found'
            });
        }
        updates.forEach((update) => stock[update] = req.body[update]);
        await stock.save();
        res.send(stock);
    } catch (error) {
        res.status(400).send(error);
    }
});

//update all stocks (ltp, profit)
const updateStocks = async () => {
    //get data from the api
    const url="http://localhost:3500/api/livedata";
    const response=await fetch(url);
    const data = await response.json();

    const stocks = await Stock.find();
    stocks.forEach(async(stock) => {
        data.forEach(async(element) => {
            if(element.Symbol==stock.nameOfCompany){
                stock.ltp=parseFloat(element.Ltp.replace(/,/g, ''));
                stock.profit=stock.numberOfShares*stock.ltp-stock.numberOfShares*stock.price;
                await stock.save();
            }
            else{
                //console.log("Stock not found");
            }
        });
    });
    console.log("Stocks updated");
}


// router.patch('/stocks',async(req, res) => {
//         //get data from the api
//         const url="https://nepstockapi.herokuapp.com/";
//         const response=await fetch(url);
//         const data = await response.json();

//         try{
//             const stocks = await Stock.find();
//             stocks.forEach(async(stock) => {
//                 data.forEach(async(element) => {
//                     if(element.Symbol==stock.nameOfCompany){
//                         stock.ltp=parseFloat(element.Close.replace(/,/g, ''));
//                         stock.profit=stock.numberOfShares*stock.ltp-stock.numberOfShares*stock.price;
//                         await stock.save();
//                     }
//                     else{
//                         console.log("Stock not found");
//                     }
//                 });
//             })
//             const allStocks = await Stock.find();
//             res.status(200).send(allStocks);
//         }catch(error){
//             res.status(400).send(error);
//         }
// });

//delete a stock by the id
router.delete('/stocks/:id',auth,async(req, res) => {
    try {
        const stock = await Stock.findOneAndDelete({_id: req.params.id, createdBy: req.user._id});
        if(!stock){
            return res.status(404).send({
                errorMessage: 'Stock not found'
            });
        }
        res.send(stock);
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = {
    router,
    updateStocks
}

