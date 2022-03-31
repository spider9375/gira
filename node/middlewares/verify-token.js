const jwt = require('jsonwebtoken');
const dotenvt = require('dotenv').config();

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    console.log(`Token:${token}`);
    if (!token) next({ $status: 403, message: `No access token` });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        req.userId = verified.userId;
        next();
    } catch (error) {
        next({ status: 403, message: `Failed to verify token.`, error });
    }
}