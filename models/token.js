const db = require('../db').getPool();

exports.delete = async userId => {
    return db.promise().execute("DELETE FROM `tokens` WHERE `user_id`=?", [userId]);
}

exports.create = async (tokenId, userId) => {
    return db.promise().execute("INSERT INTO `tokens` (`id`, `user_id`) VALUES (?, ?)", [tokenId, userId]);
}

exports.getUserId = async tokenId => {
    const [[data]] = await db.promise().execute("SELECT `user_id` FROM `tokens` WHERE `id`=?", [tokenId]);
    if(data !== undefined)
        return data.user_id;
    else return null;
}