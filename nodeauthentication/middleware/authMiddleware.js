const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Waiter = require('../models/Waiter');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(verified.id);
        
        if (!user) {
            user = await Waiter.findById(verified.id); // Check if it's a waiter
            if (!user) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
