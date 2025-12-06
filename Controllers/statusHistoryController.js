const { db } = require('../Models/db.js');


// ====================================
// Get full tracking history by tracking number
// ====================================
const getStatusHistory = (req, res) => {
    const { trackingNumber } = req.params;

    if (!trackingNumber) {
        return res.status(400).json({ message: "Tracking number is required." });
    }

    //find shipment by tracking number to get its ID
    const findShipmentQuery = `
        SELECT ID FROM SHIPMENT WHERE TRACKINGNUMBER = ?
    `;

    db.get(findShipmentQuery, [trackingNumber], (err, shipment) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error." });
        }

        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found." });
        }

        // use shipment ID to get its history
        const historyQuery = `
            SELECT * FROM STATUSHISTORY
            WHERE SHIPMENTID = ?
            ORDER BY TIMESTAMP ASC
        `;

        db.all(historyQuery, [shipment.ID], (err2, history) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ message: "Error fetching history." });
            }

            return res.status(200).json({
                trackingNumber,
                shipmentId: shipment.ID,
                history
            });
        });
    });
};

module.exports = {
    getStatusHistory
};











