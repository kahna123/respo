const Waiter = require('../models/Waiter');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Table = require('../models/Table');

// Add Waiter
exports.addWaiter = async (req, res) => {
    const { name, email, mobileNo, aadharCardNo, password } = req.body;

    try {
        const existingWaiter = await Waiter.findOne({ email });
        if (existingWaiter) {
            return res.status(400).json({ error: 'Waiter with this email already exists' });
        }

        const waiter = await Waiter.create({
            name,
            email,
            mobileNo,
            aadharCardNo,
            password,
            owner: req.user.id,// Set the owner to the current user (restaurant owner)
            Rollid:"2" 
        });

        res.status(201).json(waiter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Waiter Login
exports.waiterLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // const waiter = await Waiter.findOne({ email });/
        const waiter = await Waiter.findOne({ email }).populate('owner');
        if (!waiter) {
            return res.status(404).json({ error: 'Waiter not found' });
        }

        const isMatch = await bcrypt.compare(password, waiter.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: waiter._id }, process.env.JWT_SECRET);
        // res.json({ token:token ,data: { _id: waiter._id ,Rollid:waiter.Rollid ,owner : waiter.owner} });

        res.json({
            token,
            data: {
                _id: waiter._id,
                Rollid: waiter.Rollid,
                owner: {
                    _id: waiter.owner._id,
                    Restaurantname: waiter.owner.Restaurantname,
                    // Add other owner fields you want to send in the response here
                },
            },
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getWaiterById = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const waiter = await Waiter.findById(id);
        if (!waiter) {
            return res.status(404).json({ error: 'Waiter not found' });
        }

        res.json(waiter); // Send the waiter data as a response
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit Waiter
exports.editWaiter = async (req, res) => {
    const { id } = req.params;

    try {
        const waiter = await Waiter.findByIdAndUpdate(id, req.body, { new: true });
        res.json(waiter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Waiter
exports.deleteWaiter = async (req, res) => {
    const { id } = req.params;

    try {
        await Waiter.findByIdAndDelete(id);
        res.json({ message: 'Waiter deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// List Waiters
exports.listWaiters = async (req, res) => {
    try {
        const waiters = await Waiter.find({ owner: req.user.id });
        res.json(waiters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.showTablesByRestaurant = async (req, res) => {
    const { ownerId } = req.body; // Get restaurant ID from request body
  
    try {
      const tables = await Table.find({owner: ownerId }).populate('bookedBy', 'name email mobileNo'); // Find tables for the given restaurant ID
      res.json(tables);
    } catch (error) {
      res.status(400).send('Error fetching tables');
    }
  };



