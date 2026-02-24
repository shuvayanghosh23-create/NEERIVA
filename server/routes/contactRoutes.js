const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateAdmin } = require('../middleware/auth');

router.post('/', contactController.submitContactForm);
router.get('/admin/all', authenticateAdmin, contactController.getAllContactMessages);

module.exports = router;
