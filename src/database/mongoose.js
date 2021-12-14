const mongoose = require('mongoose');

const url='mongodb://localhost:27017/merofolio';

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url,connectionParams).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.log('MongoDB connection error: ' + err);
})