
const express = require('express');
const { getStatusHistory } = require('../Controllers/statusHistoryController');
const { verifyToken } = require('../Middleware/authMiddleware');

const statusHistoryRouter = express.Router();



// Get history for a shipment by tracking number
// GET /history/:trackingNumber

statusHistoryRouter.get('/:trackingNumber', verifyToken, getStatusHistory);


module.exports = statusHistoryRouter;