const { db } = require('../Models/db.js');
const generateTrackingNumber = require('../Utils/generateTrackingNumber');  

//token thats alreay in authmiddleware so thinking of leaving it 
// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: "No token provided." });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.user = {
//             id: decoded.id,
//             name: decoded.name,
//             role: decoded.role
//         };

//         next();
//     } catch (err) {
//         console.error(err);
//         return res.status(401).json({ message: "Invalid or expired token." });
//     }
// };




//create shipment
const createShipment = (req, res) => {
    
    const senderId = req.user.id;   // comes from verifyToken
    const {
        //senderId, //not needed keeping it for my sake
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


//get shipments created by user 
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


/* {
    "senderId":23 ,
 "receiverId":1 ,
        "originCountry": "egypt",
        "destinationCountry": "UAE",
        "weight":231,
        "size": "MEDIUM",
        "deliveryType": "STANDARD"
 }
*/