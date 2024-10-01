const express = require('express');
const {
    addWaiter,
    editWaiter,
    deleteWaiter,
    listWaiters,
    waiterLogin,
    getWaiterById, // Import the new function
    showTablesByRestaurant
} = require('../controllers/waiterController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addWaiter);
router.post('/login', waiterLogin); // Waiter login route
router.put('/:id', authMiddleware, editWaiter);
router.delete('/:id', authMiddleware, deleteWaiter);
router.get('/', authMiddleware, listWaiters);
router.get('/:id', authMiddleware, getWaiterById); // New route to get waiter by ID

router.post('/tables',authMiddleware, showTablesByRestaurant);

module.exports = router;
