const mongoose = require('mongoose');

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.MONGODB_URL,connectionParams).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.log('MongoDB connection error: ' + err);
})