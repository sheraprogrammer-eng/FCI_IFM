const express = require('express');
const router = express.Router();
const InsuranceController = require('../controllers/InsuranceController');
router.post('/ifm', InsuranceController.createIfm);
module.exports = router;