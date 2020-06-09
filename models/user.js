const db = require('../db').getPool();

exports.signUp = async (email, username, password, verifyToken) => {
    await db.promise().execute("INSERT INTO `users` (`email`, `username`, `password`, `verify_token`) VALUES (?, ?, ?, ?)", [email, username, password, verifyToken]);

    const [[{id}]]  = await db.promise().execute("SELECT `id` FROM `users` WHERE `email` = ?", [email]);
    return id;
}

exports.checkUsername = async (username) => {
    const [[{count}]] = await db.promise().execute('SELECT COUNT(*) as `count` FROM `users` WHERE `username` = ?', [username]);
    return count;
}

exports.checkEmail = async (email) => {
    const [[{count}]] = await db.promise().execute('SELECT COUNT(*) as `count` FROM `users` WHERE `email` = ?', [email]);
    return count;
}

exports.dataEmailPassword = async (id) => {
    const [[data]] = await db.promise().execute('SELECT `email`, `password` FROM `users` WHERE `id` = ?', [id]);
    return data;
}

exports.resetPassword = async (id, password) => {
    const newPassword = await db.promise().execute('UPDATE `users` SET `password` = ? WHERE `id` = ?', [password, id]);
    return newPassword;
}

exports.resetEmail = async (id, email) => {
    const newEmail = await db.promise().execute('UPDATE `users` SET `email` = ? WHERE `id` = ?', [email, id]);
    return newEmail;
}

exports.verify = async (verifyToken) => {
    return db.promise().execute('UPDATE `users` SET `verify_token` = 0 WHERE `verify_token` = ?', [verifyToken]);
}

exports.getVerifyToken = async (id) => {
    const [[{verify_token}]] = await db.promise().execute('SELECT `verify_token` FROM `users` WHERE `id` = ?', [id]);
    return verify_token;
}

exports.signIn = async login => {
    if(login.includes('@')){
        const [[data]] = await db.promise().execute("SELECT `id`, `password` FROM `users` WHERE `email` = ?", [login]);
        return data;
    }
    else{
        const [[data]] = await db.promise().execute("SELECT `id`, `password` FROM `users` WHERE `username` = ?", [login]);
        return data;
    }
}
