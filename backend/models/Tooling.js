// models/Tooling.js

const mongoose = require('mongoose');

const ToolingSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { 
        type: Number,
        required: true,
        default: function () {
            return this.qty * this.rate; // Calculate total as Qty * Rate
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Tooling', ToolingSchema);
