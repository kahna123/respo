const Order = require('../models/Order');

// Add Delivery
exports.addDelivery = async (req, res) => {
    const { deliveryDate, deliveredQty , cashprice } = req.body;

    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        order.deliveries.push({ deliveryDate, deliveredQty ,cashprice});
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit Delivery
exports.updateDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        const delivery = order.deliveries.id(req.params.deliveryId);
        if (!delivery) return res.status(404).json({ msg: 'Delivery not found' });

        Object.assign(delivery, req.body);
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// controllers/deliveryController.js
exports.getDeliveryById = async (req, res) => {
    const { orderId, deliveryId } = req.params;

    try {
        // Find the order and populate deliveries
        const order = await Order.findById(orderId).populate('deliveries');

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Find the specific delivery within the order's deliveries
        const delivery = order.deliveries.id(deliveryId); // This will return the delivery object

        if (!delivery) return res.status(404).json({ msg: 'Delivery not found' });

        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Delete Delivery
exports.deleteDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        // Find the delivery by its ID
        const delivery = order.deliveries.id(req.params.deliveryId);
        if (!delivery) return res.status(404).json({ msg: 'Delivery not found' });

        // Remove the delivery from the deliveries array
        order.deliveries = order.deliveries.filter(del => del.id !== req.params.deliveryId);

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

