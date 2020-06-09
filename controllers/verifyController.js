const User = require('../models/user');

exports.verify = async (req, res) => {
    try {
        await User.verify(req.params.verifyToken);
        return res.redirect('http://localhost:3000/q');
    } catch (err) {
        return res.status(400).json({status: false, messsage: 'Internal server error!'});
    }
}