const Watchlist = require('../models/watchlist');
const mail = require('./sendemail')
const axios = require('axios').default;
const User = require('../models/user');
const fetch = require('node-fetch');

//check every 30 seconds
const sendAlert = async function () {
    try {
        //find every notification
        const watchlist = await Watchlist.find()
        watchlist.forEach(async function (watch) {
            let price = watch.targetPrice
            let stock = watch.nameOfCompany
            let createdUserId = watch.createdBy
            //find user by Id
            const user = await User.findById(createdUserId)
            //get the email of the user
            let email = user.email

            //get data from api
            const url="http://localhost:3000/api/livedata";
            const response=await fetch(url);
            const data = await response.json();


            data.forEach(async function (asset) {
                        //compare with the stock
                        if (asset.Symbol == stock) {
                            let value = parseFloat(asset.Ltp.replace(/,/g, ''));
                            if (value <= price) {
                                let text = `The price of ${stock} has reached below your preferred amount of ${price}. The current price is ${asset.Ltp}`
                                let subject = `${stock} price fell `
                                console.log(subject)
                                await mail(email, subject, text)

                                //delete watchlist after sending email
                                await Watchlist.findByIdAndDelete(watch._id)
                            }
                        }
                    }
                    )
                })
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendAlert;
