const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true },
    createddate:{ type: Date, default: null },
    totalChairs: { type: Number, required: true },
    bookedChairs: { type: Number, default: 0 },
    guestName: { type: String, default: null }, // Guest name
    bookingTime: { type: Date, default: null }, // Booking time
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' }, // Reference to Waiter
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Table', tableSchema);



