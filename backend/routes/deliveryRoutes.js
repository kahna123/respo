const express = require('express');
const router = express.Router();
const {
    addDelivery,
    updateDelivery,
    deleteDelivery,
    getDeliveryById
} = require('../controllers/deliveryController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/:id/deliveries', authMiddleware, addDelivery);
router.put('/:orderId/deliveries/:deliveryId', authMiddleware, updateDelivery);
router.get('/:orderId/deliveries/:deliveryId', authMiddleware, getDeliveryById); 
router.delete('/:orderId/deliveries/:deliveryId', authMiddleware, deleteDelivery);

module.exports = router;
