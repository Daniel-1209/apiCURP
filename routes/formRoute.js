var express = require('express');
var router = express.Router();

let formController = require('../controllers/formController');

/* GET home page. */
router.get('/', formController.form);

router.post('/found', formController.found);

module.exports = router;
