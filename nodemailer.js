const nodemailer = require('nodemailer');
const smtpConfig = require('./config/nodemailer').smtp;

const transporter = nodemailer.createTransport(smtpConfig);
exports.transporter = transporter;