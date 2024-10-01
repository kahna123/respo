const express = require('express');
const {
    addTable,
    bookTable,
    editTable, // Import the editTable controller
    listTables,
    getBookedTables,
    unbookChairs,
    deleteTable,
    getTableById
} = require('../controllers/tableController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.post('/', addTable);
router.post('/book', bookTable);
router.put('/:id', editTable); // Add route for editing a table
router.get('/', listTables);
router.get('/booked', getBookedTables); // Endpoint to get booked tables with waiter info
router.post('/unbook', unbookChairs);
// New route to delete a table by ID
router.delete('/:tableId', deleteTable);

// New route to get a table by ID
router.get('/:tableId', getTableById);

// router.post('/by-owner', getTablesByRestaurantId);
module.exports = router;
