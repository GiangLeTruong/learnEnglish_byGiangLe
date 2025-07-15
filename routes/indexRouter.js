'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController.js')

router.get('/', controller.showHomePage);//done
router.get('/list', controller.getData, controller.showListPage);//done
router.get('/create', controller.showCreatePage);//done
router.put('/updateState/:id', controller.handleUpdateState);//done
router.get('/update/:id', controller.showUpdatePage);//done
router.get('/detail/:id', controller.getData, controller.showDetailPage);//done
router.get('/mchoice', controller.showMultiChoicePage);
router.get('/fblank', controller.showFillBlankPage);

module.exports = router;






