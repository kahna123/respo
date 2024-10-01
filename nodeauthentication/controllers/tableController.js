const Table = require('../models/Table');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Waiter = require('../models/Waiter');
// Add Table
exports.addTable = async (req, res) => {
    const { tableNumber, totalChairs ,createddate } = req.body;

    try {
        const table = await Table.create({ tableNumber, totalChairs,createddate: new Date(), owner: req.user.id });
        res.status(201).json(table);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//book tabel
exports.bookTable = async (req, res) => {
    const { tableId, chairsToBook, guestName, bookingTime } = req.body; // Get guest name and booking time from request body

    try {
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        if (chairsToBook) {
            // Check if the requested number of chairs exceeds available chairs
            const availableChairs = table.totalChairs - table.bookedChairs;
            if (chairsToBook > availableChairs) {
                return res.status(400).json({ error: `Only ${availableChairs} chairs are available for booking` });
            }

            // Update the number of booked chairs and assign the waiter
            table.bookedChairs += chairsToBook;
            table.bookedBy = req.user._id; // Use the waiter ID from the token
            table.guestName = guestName; // Store guest name
            table.bookingTime =  new Date()  // Store booking time

            await table.save();

            return res.json({ 
                message: `Successfully booked ${chairsToBook} chairs`, 
                table, 
                unbookedChairs: table.totalChairs - table.bookedChairs 
            });
        } else {
            // If chairsToBook is not provided, unbook all chairs
            table.bookedChairs = 0;
            table.bookedBy = null; // Clear the waiter
            table.guestName = null; // Clear guest name
            table.bookingTime = null; // Clear booking time
            await table.save();

            return res.json({ message: 'All chairs have been unbooked', table });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.unbookChairs = async (req, res) => {
    const { tableId, chairsToUnbook } = req.body; // Get the table ID and number of chairs to unbook from the request body

    try {
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Check if there are enough chairs to unbook
        if (chairsToUnbook > table.bookedChairs) {
            return res.status(400).json({ error: `Only ${table.bookedChairs} chairs are currently booked` });
        }

        // Update the number of booked chairs
        table.bookedChairs -= chairsToUnbook;

        // If all chairs are unbooked, clear the bookedBy, guestName, and bookingTime
        if (table.bookedChairs === 0) {
            table.bookedBy = null;
            table.guestName = null;
            table.bookingTime = null;
        }

        await table.save();

        return res.json({
            message: `Successfully unbooked ${chairsToUnbook} chairs`,
            table,
            remainingBookedChairs: table.bookedChairs
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};






// Edit Table
exports.editTable = async (req, res) => {
    const { id } = req.params;
    const { tableNumber, totalChairs } = req.body;

    try {
        const table = await Table.findOneAndUpdate(
            { _id: id, owner: req.user.id }, // Ensure the table belongs to the logged-in user
            { tableNumber, totalChairs },
            { new: true }
        );
        if (!table) return res.status(404).json({ error: 'Table not found or unauthorized' });

        res.json(table);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// List Tables
exports.listTables = async (req, res) => {
    try {
        const tables = await Table.find({ owner: req.user.id });
        res.json(tables);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Booked Tables with Waiter Info
exports.getBookedTables = async (req, res) => {
    try {
        const tables = await Table.find({ owner: req.user.id })
            .populate('bookedBy', 'name email mobileNo') // Populate the waiter info
            .exec();

        res.json(tables);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Delete a table by ID
exports.deleteTable = async (req, res) => {
    const { tableId } = req.params; // Get table ID from request params
    const ownerId = req.user._id; // Get user ID from token (assumes authMiddleware adds req.user)

    try {
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Check if the logged-in user is the owner of the table
        if (table.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You do not have permission to delete this table' });
        }

        await Table.findByIdAndDelete(tableId);
        return res.json({ tableId: tableId, message: 'Table deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get a table by ID
exports.getTableById = async (req, res) => {
    const { tableId } = req.params; // Get table ID from request params
    const ownerId = req.user._id; 
    try {
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        if (table.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You do not have permission to delete this table' });
        }

        return res.json(table);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};