'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/vocabularyController.js')

router.post('/create', controller.create);
router.post('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);

module.exports = router;






