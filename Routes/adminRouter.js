const express = require('express');
const { 
    getAllShipments,
    approveShipment,
    rejectShipment,
    updateShipmentStatus
} = require('../Controllers/adminController');

const { verifyToken, requireAdmin } = require('../Middleware/authMiddleware');

const adminRouter = express.Router();

// Get ALL shipments (ADMIN ONLY)
// GET /admin/shipments

adminRouter.get('/shipments', verifyToken, requireAdmin, getAllShipments);


// Approve a shipment (ADMIN ONLY)
// it will look like this  PUT /admin/shipments/:id/approve

adminRouter.put('/shipments/:id/approve', verifyToken, requireAdmin, approveShipment);


// Reject a shipment (ADMIN ONLY)
// it will be like this PUT /admin/shipments/:id/reject

adminRouter.put('/shipments/:id/reject', verifyToken, requireAdmin, rejectShipment);

// Update shipment status + log history
// it will be like this PUT /admin/shipments/:id/status

adminRouter.put('/shipments/:id/status', verifyToken, requireAdmin, updateShipmentStatus);


module.exports = adminRouter;
