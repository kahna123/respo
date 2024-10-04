const express = require('express');
const router = express.Router();
const {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    downloadExcel,
    getOrderById,
} = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.get('/downloadexcel', authMiddleware, downloadExcel);

router.post('/', authMiddleware, createOrder);
router.put('/:id', authMiddleware, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);
router.get('/', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
// router.get('/download-excel', authMiddleware, downloadExcel);

module.exports = router;
