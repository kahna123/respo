const Tooling = require('../models/Tooling');
const Order = require('../models/Order');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
// controllers/toolingController.js
exports.addTooling = async (req, res) => {
    try {
        // Extract the tooling data from the request body and user ID from the token
        const toolingData = { ...req.body, user: req.user };

        // Create a new Tooling instance
        const tooling = new Tooling(toolingData);
        await tooling.save();

        res.status(200).json(tooling);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Edit Tooling
exports.updateTooling = async (req, res) => {
    try {
        // Destructure qty and rate from the request body
        const { qty, rate } = req.body;

        // Calculate the total
        const total = qty * rate;

        // Update the tooling with the new total
        const tooling = await Tooling.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, total }, // Include the total in the update
            { new: true }
        );

        if (!tooling) return res.status(404).json({ msg: 'Tooling not found' });

        res.status(200).json(tooling);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete Tooling
exports.deleteTooling = async (req, res) => {
    try {
        const tooling = await Tooling.findByIdAndDelete(req.params.id);
        if (!tooling) return res.status(404).json({ msg: 'Tooling not found' });

        res.status(200).json({ msg: 'Tooling deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// List All Toolings
exports.listToolings = async (req, res) => {
    try {

        const orders = await Tooling.find({ user: req.user });
        if(orders)
        {
            const toolings = await Tooling.find();
            res.status(200).json(toolings);
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Tooling by ID
exports.getToolingById = async (req, res) => {
    try {
        const tooling = await Tooling.findById(req.params.id);
        if (!tooling) return res.status(404).json({ msg: 'Tooling not found' });

        res.status(200).json(tooling);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.downloadExcel = async (req, res) => {
    try {
        const toolings = await Tooling.find({ user: req.user });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tooling');

        worksheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Quantity', key: 'qty', width: 15 },
            { header: 'Rate', key: 'rate', width: 15 },
            { header: 'Total', key: 'total', width: 15 },
        ];

        toolings.forEach(tooling => {
            worksheet.addRow({
                date: tooling.date.toISOString().split('T')[0],
                description: tooling.description,
                qty: tooling.qty,
                rate: tooling.rate,
                total: tooling.total,
            });
        });

        const dirPath = path.join(__dirname, '..', 'files');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, 'toolings.xlsx');
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await workbook.xlsx.writeFile(filePath);
        res.download(filePath, 'toolings.xlsx');
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: error.message });
    }
};



