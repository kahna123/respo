// routes/toolingRoutes.js
const express = require('express');
const router = express.Router();
const {
    addTooling,
    updateTooling,
    deleteTooling,
    listToolings,
    getToolingById,
	downloadExcel
} = require('../controllers/toolingController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.get('/downloadexcel', authMiddleware, downloadExcel);

router.post('/', authMiddleware, addTooling);
router.put('/:id', authMiddleware, updateTooling);
router.delete('/:id', authMiddleware, deleteTooling);
router.get('/', authMiddleware, listToolings);
router.get('/:id', authMiddleware, getToolingById);


module.exports = router;
