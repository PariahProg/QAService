
const {secret, tokens} = require('../config/app').jwt;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Token = require('../models/token');


exports.generateAccessToken = (userId) => {
    const payload = {
        //id: uuidv4(),
        userId: userId,
        type: tokens.access.type,
    };
    const options = {expiresIn: tokens.access.expiresIn};

    return jwt.sign(payload, secret, options);
}

exports.generateRefreshToken = () => {
    const payload = {
        id: uuidv4(),
        type: tokens.refresh.type,
    };

    const options = {expiresIn: tokens.refresh.expiresIn};

    return {
        id: payload.id,
        token: jwt.sign(payload, secret, options),
    }
}

exports.replaceDbRefreshToken = async (tokenId, userId) => {
    await Token.delete(userId);
    await Token.create(tokenId, userId);
}

exports.isEmail = email => {
    const isEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return isEmail.test(email);
}

exports.isUsername = username => {
    const isUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return isUsername.test(username);
}

exports.isPassword = password => {
    const isPassword = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/;
    return isPassword.test(password);
}