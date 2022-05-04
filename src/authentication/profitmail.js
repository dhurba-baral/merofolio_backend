const mail = require('./sendemail');
const User = require('../models/user');
const TargetProfit = require('../models/profit');

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
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendProfitAlert;
