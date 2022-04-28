const cron = require('node-cron');
const Notification = require('../models/notify');
const mail = require('./sendemail')
const axios = require('axios').default;

//check every 30 seconds
let sendAlert = cron.schedule("*/30 * * * * *", async function () {
    try {
        //find every notification
        const notifications = await Notification.find()
        notifications.forEach(async function (notify) {
            let price = notify.stockprice
            let stock = notify.stockname
            let email = notify.email
            axios.get(`http://localhost:3000/api/livedata`)
                .then(response => {
                    response.data.forEach(async function (asset) {
                        //compare with the stock
                        if (asset.Companyname === stock) {
                            let value = parseInt(asset.Ltp)
                            if (value <= price) {
                                let text = `The price of ${stock} has reached below your preferred amount of ${price}. The current price is ${asset.Ltp}`
                                let subject = `${stock} price fell `
                                console.log(subject)
                                await mail(email, subject, text)
                                await Notification.findByIdAndDelete(notify._id)
                            }
                        }
                    }
                    )
                }).catch(error => {
                    console.log(error);
                })
        })
    } catch (error) {
        console.log(error);
    }
})

sendAlert.start()
