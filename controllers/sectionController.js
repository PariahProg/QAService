const Sections = require('../models/section');

exports.getSections = async (req, res) => {
    Sections.getSections()
        .then(([rows, fields]) => {
            return res.json({status: true, rows});
        })
        .catch (error => {
            console.log(error);
            return res.status(500).json({status: false, message: 'Internal server error!'});
        });
    }
