const jwt = require('jsonwebtoken');
const User = require("../models/user");
const {role} = require("../utils");

module.exports = async function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) next({ $status: 403, message: `No access token` });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified.role === role.user) {
            next({status: 401});
        } else {
            req.userId = verified.userId;
            req.user = await User.findById(verified.userId);
            next();
        }
    } catch (error) {
        next({ status: 403, message: `Failed to verify token.`, error });
    }
}