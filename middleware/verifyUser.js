// const auth = require('../middleware/auth');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    const verifyToken = await User.getVerifyToken(res.locals.payload.userId);
    if (verifyToken === '0') {
        return next();
    } else {
        return res.status(401).json({status: false, message: 'Account is not verified'});
    }
}