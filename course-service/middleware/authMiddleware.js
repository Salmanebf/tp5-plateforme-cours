const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401).json({message: "Le token est obligatoire pour l'authentification"});
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err)
            return res.sendStatus(403).json({ message: "token invalid" });
        else {
            req.user = userData;
            next();
        }
    });
};
module.exports = verifyToken;