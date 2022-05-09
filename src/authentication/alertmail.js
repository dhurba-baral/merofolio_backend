const Watchlist = require('../models/watchlist');
const mail = require('./sendemail')
const axios = require('axios').default;
const User = require('../models/user');
const fetch = require('node-fetch');
// const PushNotification = require('../models/pushnotification');
// const webPush = require('web-push');

// const publicVapidKey = "BKUewihHNqZsFYslvLFrIJzokdTWSuCMYwXn39LxdM6P0q8WJ41c8ItvPOozKbxkXOxz97tDyAryq_3oNeTsljw"
// const privateVapidKey = "Kf1LUobWiS-fZBWwDC2uyh9dwO2Y0xGNHoqgj1Y7UoM"
// webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)


const sendAlert = async function () {
    try {
        //find every watchlist
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
            const url="http://localhost:3500/api/livedata";
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

                                // //get the subscription from the user
                                // const subscription = await PushNotification.findOne({ createdBy: createdUserId })
                                // const payload = JSON.stringify({ title: "Merofolio"})
                                // await webPush.sendNotification(subscription, payload)

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
