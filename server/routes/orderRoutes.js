const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, orderController.placeOrder);
router.get('/user', authenticateToken, orderController.getUserOrders);
router.put('/:orderId', authenticateToken, orderController.updateOrder);
router.delete('/:orderId', authenticateToken, orderController.cancelOrder);

router.get('/admin/all', authenticateAdmin, orderController.getAllOrders);
router.put('/admin/:orderId/status', authenticateAdmin, orderController.updateOrderStatus);

module.exports = router;
