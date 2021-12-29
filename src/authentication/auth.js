const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);// gives id and iat of the verified user
        console.log(decoded);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;  //to send the token to the next middleware
        req.user = user;  //to send the user to the next middleware
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

module.exports = auth;