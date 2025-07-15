const controller = {};
const models = require('../models');

controller.create = async (req, res) => {

    res.render('vocabulary-list');
}



module.exports = controller;