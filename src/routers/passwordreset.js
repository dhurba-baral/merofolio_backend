const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Otp = require('../models/otp')
const sendMailForForgotPassword = require('../authentication/sendemail');

router.post('/user/sendotp',async (req, res) => {
    try {
        const findUser = await User.findOne({email: req.body.email});
        if(!findUser){
            return res.status(404).send({
                errorMessage: 'User not found'
            });
        }
        let findOtp = await Otp.findOne({ email: req.body.email });
        if (findOtp) {
            await findOtp.deleteOne();
        }

        let otp = Math.floor(Math.random() * 1000000);
        const newOtp = new Otp({
            userId: findUser._id,
            email: req.body.email,
            otp: otp,
            expirydate: new Date().getTime() + 300 * 1000
        });
        await newOtp.save();

        let text = `Use the otp to reset your password ${otp}`
        let subject = `Password reset`
        await sendMailForForgotPassword(req.body.email, subject, text);
        res.status(201).send({ otp });

    } catch (err) {
        res.status(400).send(error);
    }
})

router.post('/user/changepassword',async (req, res) => {
    try {
        let getOtp = await Otp.findOne({ email: req.body.email, otp: req.body.otp });
        if (!getOtp) {
            res.status(401).send({ errorMessage: 'Invalid Otp ' });
        }

        let currentTime = new Date().getTime();
        let difference = getOtp.expirydate - currentTime;
        if (difference < 0) {
            res.status(401).send({ errorMessage: 'Token has expired' });
        }
        else {
            let date = new Date();
            let user = await User.findById(getOtp.userId);
            user.password = req.body.password;
            await user.save();
            await getOtp.deleteOne();

            let subject = `Password reset successful`
            let text = `Your password was changed on ${date}`
            await sendMailForForgotPassword(req.body.email, subject, text)
            res.status(201).send(user);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;