const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

router.post('/tickets', authenticateToken, supportController.createTicket);
router.get('/tickets/user', authenticateToken, supportController.getUserTickets);

router.get('/tickets/admin/all', authenticateAdmin, supportController.getAllTickets);
router.put('/tickets/admin/:ticketId/reply', authenticateAdmin, supportController.replyToTicket);
router.put('/tickets/admin/:ticketId/resolve', authenticateAdmin, supportController.resolveTicket);

module.exports = router;
