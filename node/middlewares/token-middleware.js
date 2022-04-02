const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) next({ $status: 403, message: `No access token` });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;
        req.user = verified;
        next();
    } catch (error) {
        next({ status: 403, message: `Failed to verify token.`, error });
    }
}