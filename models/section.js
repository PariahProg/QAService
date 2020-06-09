const db = require('../db').getPool();

exports.getSections = async () => {
    return db.promise().query('SELECT * FROM sections');
}
