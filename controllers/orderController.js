const Order = require('../models/Order');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Create Order
exports.createOrder = async (req, res) => {
    const { orderDate, invoiceNo, description, totalQty, pricePerUnit } = req.body;

    try {
        const order = new Order({
            user: req.user,
            orderDate,
            invoiceNo,
            description,
            totalQty,
            pricePerUnit,
            deliveries: [] // No initial deliveries
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit Order
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        Object.assign(order, req.body);
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ msg: 'Order deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Order By ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email'); // Populate user email if needed
        if (!order) return res.status(404).json({ msg: 'Order not found' });


        // Check if the user making the request is authorized to view this order
        if (order.user._id.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });


        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get All Orders with Excel URL
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user });
        const excelUrl = `${req.protocol}://${req.get('host')}/api/orders/download-excel`;

        res.status(200).json({ orders, excelUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Generate Excel File for All Orders

// Generate Excel File for All Orders
exports.downloadExcel = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user }).populate('deliveries');

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

        // Define columns including delivery details
        worksheet.columns = [
            { header: 'Order Date', key: 'orderDate', width: 20 },
            { header: 'Invoice No', key: 'invoiceNo', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Total Qty', key: 'totalQty', width: 10 },
            { header: 'Total Delivered Qty', key: 'totalDeliveredQty', width: 20 },
            { header: 'Price Per Unit', key: 'pricePerUnit', width: 15 },
            { header: 'Total Price', key: 'totalPrice', width: 15 },
            { header: 'Total Cash Price', key: 'totalCashPrice', width: 15 },
            { header: 'Delivery Date', key: 'deliveryDate', width: 20 },
            { header: 'Delivered Qty', key: 'deliveredQty', width: 15 },
            { header: 'Cash Price', key: 'cashPrice', width: 15 },
            { header: 'Status', key: 'status', width: 10 }
        ];

        // Add rows including deliveries
        orders.forEach(order => {
            // Calculate total cash price for the order
            const totalCashPrice = order.deliveries.reduce((acc, delivery) => acc + (Number(delivery.cashprice) || 0), 0);

            // Determine the order status
            let orderStatus = 'Pending'; // Default status
            if (order.totalPrice === totalCashPrice && order.totalQty === order.totalDeliveredQty) {
                orderStatus = 'Order Completed';
            } else if (order.totalPrice === totalCashPrice) {
                orderStatus = 'Payment Completed';
            } else if (order.totalQty === order.totalDeliveredQty) {
                orderStatus = 'Delivery Completed';
            }

            // Add the order row
            const orderRow = {
                orderDate: order.orderDate ? order.orderDate.toISOString().split('T')[0] : '',
                invoiceNo: order.invoiceNo || '',
                description: order.description || '',
                totalQty: order.totalQty || 0,
                totalDeliveredQty: order.totalDeliveredQty || 0,
                pricePerUnit: order.pricePerUnit || 0,
                totalPrice: order.totalPrice || 0,
                totalCashPrice: totalCashPrice, // Set total cash price here
                status: orderStatus // Set the calculated order status here
            };
            worksheet.addRow(orderRow);

            // Add each delivery related to the order
            order.deliveries.forEach(delivery => {
                worksheet.addRow({
                    orderDate: '', // Keep this empty for deliveries
                    invoiceNo: '', // Keep this empty for deliveries
                    description: '', // Keep this empty for deliveries
                    totalQty: '',
                    totalDeliveredQty: '',
                    pricePerUnit: '',
                    totalPrice: '',
                    totalCashPrice: '', // Keep this empty for deliveries
                    deliveryDate: delivery.deliveryDate ? delivery.deliveryDate.toISOString().split('T')[0] : '',
                    deliveredQty: delivery.deliveredQty || 0,
                    cashPrice: delivery.cashprice || 0,
                    status: '' // Keep this empty for deliveries
                });
            });
        });

        // Define the file path
        const dirPath = path.join(__dirname, '..', 'files');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, 'orders.xlsx');

        // Remove any existing file before writing a new one
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Write the Excel file
        await workbook.xlsx.writeFile(filePath);

        res.download(filePath, 'orders.xlsx');
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: error.message });
    }
};