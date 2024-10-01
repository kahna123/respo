const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNo: { type: String, required: true },
    aadharCardNo: { type: String, required: true },
    Restaurantname: { type: String, required: true },
    Rollid: { type: String},
});

module.exports = mongoose.model('User', userSchema);
