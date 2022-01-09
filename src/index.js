const express=require('express');
const app=express();
const userRouter=require('./routers/user');
const questionRouter=require('./routers/question');
const replyRouter=require('./routers/reply');
require('dotenv').config();
require('./database/mongoose');


app.use(express.json())
app.use(userRouter);
app.use(questionRouter);
app.use(replyRouter);

app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});