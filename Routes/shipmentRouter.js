const express = require('express');
const { 
    createShipment, 
    getUserShipments, 
    getShipmentByTrackingNumber 
} = require('../Controllers/shipmentController');

const { verifyToken } = require('../Middleware/authMiddleware');

const shipmentRouter = express.Router();



// Create shipment (USER)
shipmentRouter.post('/create',verifyToken, createShipment); //verifyToken

// Get all shipments for logged-in user
shipmentRouter.get('/mine', verifyToken, getUserShipments);


// Track shipment by tracking number

shipmentRouter.get('/track/:trackingNumber', verifyToken, getShipmentByTrackingNumber);


module.exports = shipmentRouter;
