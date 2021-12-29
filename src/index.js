const express=require('express');
const app=express();
const userRouter=require('./routers/user');
require('dotenv').config();
require('./database/mongoose');


app.use(express.json())
app.use(userRouter);


app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});