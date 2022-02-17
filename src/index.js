const express=require('express');
const cron=require('node-cron');
const app=express();
const userRouter=require('./routers/user');
const questionRouter=require('./routers/question');
const replyRouter=require('./routers/reply');
const stocksFile=require('./routers/stocks');
const passwordresetRouter=require('./routers/passwordreset');
const watchlistRouter=require('./routers/watchlist');
require('dotenv').config();
require('./database/mongoose');


app.use(express.json())
app.use(userRouter);
app.use(questionRouter);
app.use(replyRouter);
app.use(stocksFile.router);
app.use(passwordresetRouter);
app.use(watchlistRouter);


//run every minute
cron.schedule('* * * * *', () => {
    stocksFile.updateStocks();
});


app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});