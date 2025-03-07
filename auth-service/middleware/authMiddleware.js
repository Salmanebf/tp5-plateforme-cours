const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err)
            return res.sendStatus(403);
        else {
            req.user = userData;
            next();
        }
    });
};
module.exports = verifyToken;