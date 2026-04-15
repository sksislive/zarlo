const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getSellerOrders, getOrders } = require('../controllers/orderController');
const { protect, seller, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/sellerorders').get(protect, seller, getSellerOrders);
router.route('/all').get(protect, admin, getOrders);

module.exports = router;
