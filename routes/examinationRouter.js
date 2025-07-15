'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/examinationController.js')

router.get('/create', controller.create);

module.exports = router;