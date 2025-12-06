const { db } = require('../Models/db.js');
const generateTrackingNumber = require('../Utils/generateTrackingNumber');  


// ====================================
// CREATE SHIPMENT
// ====================================
const createShipment = (req, res) => {
    const senderId = req.user.id;   // comes from verifyToken
    const {
        receiverId,
        originCountry,
        destinationCountry,
        weight,
        size,
        deliveryType
    } = req.body;

    // Check required fields
    if (!receiverId || !originCountry || !destinationCountry || !weight || !size || !deliveryType) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    const query = `
        INSERT INTO SHIPMENT 
        (TRACKINGNUMBER, SENDERID, RECEIVERID, ORIGINCOUNTRY, DESTINATIONCOUNTRY, 
         WEIGHT, SIZE, DELIVERYTYPE, STATUS, CREATEDAT)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'))
    `;

    const params = [
        trackingNumber,
        senderId,
        receiverId,
        originCountry,
        destinationCountry,
        weight,
        size,
        deliveryType
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error creating shipment." });
        }

        return res.status(201).json({
            message: "Shipment created successfully.",
            shipmentId: this.lastID,
            trackingNumber
        });
    });
};


// ====================================
// GET SHIPMENTS CREATED BY USER
// ====================================
// Get shipments created by user whether thats sender or receiever 
const getUserShipments = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT * FROM SHIPMENT
        WHERE SENDERID = ? OR RECEIVERID = ?
        ORDER BY CREATEDAT DESC
    `;

    db.all(query, [userId, userId], (err, shipments) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error fetching shipments." });
        }

        return res.status(200).json({ shipments });
    });
};



// Get shipment by Tracking Number 

const getShipmentByTrackingNumber = (req, res) => {
    const { trackingNumber } = req.params;

    const query = `
        SELECT * FROM SHIPMENT WHERE TRACKINGNUMBER = ?
    `;

    db.get(query, [trackingNumber], (err, shipment) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error fetching shipment." });
        }

        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found." });
        }

        return res.status(200).json({ shipment });
    });
};


module.exports = {
    createShipment,
    getUserShipments,
    getShipmentByTrackingNumber
};
