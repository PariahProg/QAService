const transporter = require('../nodemailer').transporter;


exports.sendVerifyEmail = async (email, verifyToken) => {
    const message = {
        from: 'QA Service <pariah.mail@yandex.ru>',
        to: email,
        subject: 'E-mail verification',
        html:`
            <h2>Please press the "Verify button" to verify an e-mail!</h2>
            <form method="POST" action="http://localhost:8080/confirm/${verifyToken}">
                <input type="submit" value="Verify">
            </form>
        `
    }
    transporter.sendMail(message).catch(e => console.log(e));
}

exports.sendNewEmail = async (email) => {
    const message = {
        from: 'QA Service <pariah.mail@yandex.ru>',
        to: email,
        subject: 'E-mail dropping',
        html: `
            <h2>Your e-mail has successfully dropped!</h2>
            
        `
        // <form method="POST" action="http://localhost:8080/user/resetEmail">
        //         <input type="submit" value="Reset">
        //     </form>
    }
    transporter.sendMail(message).catch(e => console.log(e));
}

exports.sendNewPassword = async (email) => {
    const message = {
        from: 'QA Service <pariah.mail@yandex.ru>',
        to: email,
        subject: 'Password dropping',
        html: `
            <h2>Your password has successfully dropped!</h2>
        `
        // <form method="POST" action="http://localhost:8080/user/resetPassword">
        //         <input type="submit" value="Reset">
        //     </form>
    }
    transporter.sendMail(message).catch(e => console.log(e));
}