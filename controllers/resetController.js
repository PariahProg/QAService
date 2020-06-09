const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = require ('../config/app').saltRounds;
const emailHelper = require('../helper/emailHelper');
const authHelper = require('../helper/authHelper');

exports.resetPassword = async (req, res) => {
    if(!req.body)
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    let {password} = req.body;

    if(!password)
        return res.status(400).json({status: false, message: 'Not enough parameters provided!'});

    if(!authHelper.isPassword(password)) {
        return res.status(412).json({status: false, message: 'Password does not match to the pattern!'});
    }

    try {
        let salt = bcrypt.genSaltSync(saltRounds);
    
        let passwortdToSave = bcrypt.hashSync(password, salt);
        const data = await User.dataEmailPassword(res.locals.payload.userId);
        const isValid = await bcrypt.compare(password, data.password);

        if(isValid)
            return res.status(406).json({status: false, message: 'Cannot reset a password. Password already exists!'});
        await User.resetPassword(res.locals.payload.userId, passwortdToSave);
        emailHelper.sendNewPassword(data.email);

        return res.status(200).json({status: true});
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.resetEmail = async (req, res) => {
    
    if(!req.body)
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    let {email} = req.body;

    if(!email)
        return res.status(400).json({status: false, message: 'Not enough parameters provided!'});

    if(!authHelper.isEmail(email)) {
        return res.status(412).json({status: false, message: 'Email does not match to the pattern!'});
    }

    try {
        let isExistedEmail = await User.checkEmail(email);

        const data = await User.dataEmailPassword(res.locals.payload.userId);

        if(isExistedEmail)
            return res.status(406).json({status: false, message: 'Cannot reset an email. Email already exists!'});

        await User.resetEmail(res.locals.payload.userId, email);
        emailHelper.sendNewEmail(data.email);
        return res.status(200).json({status: true});
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}