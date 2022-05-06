const express=require('express');
const cron=require('node-cron');
const app=express();
const cors = require('cors')
const userRouter=require('./routers/user');
const questionRouter=require('./routers/question');
const replyRouter=require('./routers/reply');
const stocksFile=require('./routers/stocks');
const passwordresetRouter=require('./routers/passwordreset');
const watchlistRouter=require('./routers/watchlist');
const profitRouter=require('./routers/profit');
const User=require('./models/user');
const pushRouter=require('./routers/pushalert');
const sendAlert = require('./authentication/alertmail');
require('dotenv').config();
require('./database/mongoose');

app.use(cors())
app.use(express.json())
app.use(userRouter);
app.use(questionRouter);
app.use(replyRouter);
app.use(stocksFile.router);
app.use(passwordresetRouter);
app.use(watchlistRouter);
app.use(pushRouter);
app.use(profitRouter);


//run everyday at 3:01 pm
cron.schedule('1 15 * * *', () => {
    stocksFile.updateStocks();
});

//update every everyday at 3:01 pm
cron.schedule('1 15 * * *', async () => {
    const users =await User.find();
    users.forEach(async (user) => {
        await user.getDateAndProfit();
    });
});

//delete every everyday at 3:01 pm
cron.schedule('1 15 * * *', async () => {
    const users =await User.find();
    users.forEach(async (user) => {
        await user.deleteDateAndProfit();
    });
});

//run every one minute for watchlist notification
cron.schedule('* * * * *', () => {
    sendAlert();
});




app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});