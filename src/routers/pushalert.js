
const express = require('express')
const router = new express.Router();
const webPush = require('web-push');
const PushNotification = require('../models/pushnotification')
const publicVapidKey = "BKUewihHNqZsFYslvLFrIJzokdTWSuCMYwXn39LxdM6P0q8WJ41c8ItvPOozKbxkXOxz97tDyAryq_3oNeTsljw"
const privateVapidKey = "Kf1LUobWiS-fZBWwDC2uyh9dwO2Y0xGNHoqgj1Y7UoM"

const saveToDatabase = async subscription => {
    const push = new PushNotification({subscription,createdBy: req.user._id})
    try {
        const checkNotification = await PushNotification.findOne({ endpoint: subscription.endpoint });
        if (checkNotification) {
            return
        }
        await push.save()
    } catch (error) {
        console.log(error)
    }
}

webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

router.post('/notify', async (req, res) => {
    const subscription = req.body
    await saveToDatabase(subscription) //Method to save the subscription to Database
    res.json({ message: 'success' })
})

module.exports = router;