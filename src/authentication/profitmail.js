const mail = require('./sendemail');
const User = require('../models/user');
const TargetProfit = require('../models/profit');
const webPush = require('web-push');
const PushNotification = require('../models/pushnotification')

const publicVapidKey = "BKUewihHNqZsFYslvLFrIJzokdTWSuCMYwXn39LxdM6P0q8WJ41c8ItvPOozKbxkXOxz97tDyAryq_3oNeTsljw"
const privateVapidKey = "Kf1LUobWiS-fZBWwDC2uyh9dwO2Y0xGNHoqgj1Y7UoM"
webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

const sendProfitAlert = async function () {
    try {
        //find every targetprofit
        const targetProfit = await TargetProfit.find()
        targetProfit.forEach(async function (target){
            let profit = target.targetProfit;
            let createdUserId = target.createdBy;
            //find user by Id
            const user = await User.findById(createdUserId)
            //get the email of the user
            let email = user.email
            //get the profit of user
            // let totalProfit = user.graphdata.totalProfit.slice(-1).pop()
            let totalProfit = user.graphdata.totalProfit[user.graphdata.totalProfit.length-1] 
            if (totalProfit >= profit){
                let text = `Your portfolio has reached the preferred profit of ${profit}. Your portfolio is currently at a profit of ${totalProfit}`;
                let subject = `Profit reached`
                await mail(email, subject, text)
                const subscription = await PushNotification.findById({ createdBy: createdUserId })
                const payload = JSON.stringify({ title: "Merofolio", body:"Portfolio profit reached" })
                await webPush.sendNotification(subscription, payload)
                await TargetProfit.findByIdAndDelete(target._id)
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendProfitAlert;