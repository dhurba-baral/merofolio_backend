const express = require('express');
const router = new express.Router();
const auth = require('../authentication/auth');
const Notification = require('../models/notify');
const webPush = require('web-push');
const publicVapidKey = "BKUewihHNqZsFYslvLFrIJzokdTWSuCMYwXn39LxdM6P0q8WJ41c8ItvPOozKbxkXOxz97tDyAryq_3oNeTsljw"
const privateVapidKey = "Kf1LUobWiS-fZBWwDC2uyh9dwO2Y0xGNHoqgj1Y7UoM"

router.post('/newnotification', auth,async (req, res) => {
    const notification = new Notification({
        ...req.body,
        createdBy: req.user._id,
        email: req.user.email
    });
    try {
        await notification.save();
        res.status(201).send("Alert created");
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/allnotifications', auth,async (req, res) => {
    try {
        const notifications = await Notification.find({ createdBy: req.user._id });
        res.send(notifications);
    } catch (error) {
        res.status(500).send();
    }
})


webPush.setVapidDetails('mailto:test@test.com', publicVapidKey,privateVapidKey);

router.post('/notify',async (req,res)=>{
    try {
    //get pushSubscription object
    const subscription = req.body;
    console.log(subscription)

    //send201 - resource created
    res.status(201).json({});

    //create payload
    const payload = JSON.stringify({title:"Merofolio"})

    //pass object into send notification function
    webPush.sendNotification(subscription, payload)
    // .then(result => console.log(result))
    .catch(err => console.log(err))
}
catch(error){
    console.log(error)
}
})

module.exports = router