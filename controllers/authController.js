const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require ('../config/app').jwt;
const saltRounds = require ('../config/app').saltRounds;
const authHelper = require('../helper/authHelper');
const Token = require('../models/token');
//const { v4: uuidv4 } = require('uuid');
const emailHelper = require('../helper/emailHelper');

exports.updateTokens = async (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    await authHelper.replaceDbRefreshToken(refreshToken.id, userId);
    return {
        accessToken,
        refreshToken: refreshToken.token,
    }
}

exports.signUp = async (req, res) => {
    if(!req.body) 
        return res.status(400).json({status: false, message: 'Required information not provided!'});
    
    let {email, username, password} = req.body;

    if(!email || !username || !password)
        return res.status(400).json({status: false, message: 'Not enough parameters provided!'});
    
    if(!authHelper.isEmail(email) || !authHelper.isUsername(username) || !authHelper.isPassword(password)){
        return res.status(412).json({status: false, message: 'One or more parameters do not conform to the pattern!'});
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    
    let passwordToSave = bcrypt.hashSync(password, salt);
    
    let verifyToken = bcrypt.hashSync(username + Date.now(), salt);
    verifyToken = verifyToken.replace(/./g, '$');
    
    try {
        let isExisted = await User.checkEmail(email);
        if(isExisted)
            return res.status(406).json({status: false, message: 'Cannot add a new user. Email already exists!'});
        
        isExisted = await User.checkUsername(username);
        if(isExisted)
            return res.status(406).json({status: false, message: 'Cannot add a new user. Username already exists!'});

        let userId = await User.signUp(email, username,  passwordToSave, verifyToken);
        let tokens = await this.updateTokens(userId);
        //res.cookie('an', tokens.accessToken, {httpOnly: true, maxAge: 1000*60*15});
        res.cookie('rn', tokens.refreshToken, {httpOnly: true, maxAge: 1000*60*60*24*60});
        emailHelper.sendVerifyEmail(email, verifyToken);
        return res.status(200).json({status: true, email, username, accessToken: tokens.accessToken});
    } catch(err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }   
}

exports.signIn = async (req, res) => {
    if(!req.body)
        return res.status(400).json({status: false, message: 'Required information not provided!'});
    
    let {login, password} = req.body;
    
    if(!login || !password)
        return res.status(400).json({status: false, message: 'Not enough parameters provided!'});

    try {
        const userData = await User.signIn(login);
        const isValid = await bcrypt.compare(password, userData.password);
        if(isValid) {
            const tokens  = await this.updateTokens(userData.id);
            //res.cookie('an', tokens.accessToken, {httpOnly: true, maxAge: 1000*60*15});
            res.cookie('rn', tokens.refreshToken, {httpOnly: true, maxAge: 1000*60*60*24*60});
            return res.status(200).json({status: true, login, accessToken: tokens.accessToken});
        }
        else {
            res.status(406).json({status: false, message: 'Invalid credentials!'});
        }
    } catch(err) {
        return res.status(500).json({status: false, message: 'Internal server error!'});
    }
}

exports.logout = async (req, res) => {
    //res.clearCookie('an');
    res.clearCookie('rn');
    return res.status(200).json({status: true});
}

exports.refreshTokens = async (req, res) =>{
    if(!req.cookies)
        return res.status(400).json({status: false, message: 'Cookie not provided!'});
    if(!req.cookies.rn)
        return res.status(400).json({status: false, message: 'Required information not provided!'});

    let refreshToken = req.cookies.rn;
    let payload = null;
    try {
        payload = jwt.verify(refreshToken, secret);
        if(payload.type !== 'refresh') {
            return res.status(400).json({status: false, message: 'Invalid token type!'});
        }
    }
    catch (err) {
        if(err instanceof jwt.TokenExpiredError){
            return res.status(400).json({status: false, message: 'Token is expired!'});
        }
        else if(err instanceof jwt.JsonWebTokenError){
            return res.status(400).json({status: false, message: 'Invalid token!'});
        }
    }

    const userId = await Token.getUserId(payload.id);
    if(userId !== null){
        let tokens = await this.updateTokens(userId);
        //res.cookie('an', tokens.accessToken, {httpOnly: true, maxAge: 1000*60*15});
        res.cookie('rn', tokens.refreshToken, {httpOnly: true, maxAge: 1000*60*60*24*60});
        return res.status(200).json({status: true, accessToken: tokens.accessToken});
    }
    else{
        return res.status(400).json({status: false, message: 'Invalid token!'});
    }
}