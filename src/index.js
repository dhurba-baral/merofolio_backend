const express=require('express');
const app=express();
const userRouter=require('./routers/user');

app.use(userRouter);

app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});