const { db } = require('../Models/db.js');


//get all shipments for admin
const getAllShipments = (req, res) => {
    const query = `
        SELECT * FROM SHIPMENT
        ORDER BY CREATEDAT DESC
    `;

    db.all(query, [], (err, shipments) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error fetching shipments." });
        }

        return res.status(200).json({ shipments });
    });
};



// UPDATE SHIPMENT STATUS (AND LOG HISTORY) +  approved and rejected 
const updateShipmentStatus = (req, res) => {
    const shipmentId = req.params.id;
    const { status, message } = req.body;

    if (!status || !message) {
        return res.status(400).json({ message: "Status and message are required." });
    }


    // Only allowing one of these two to get to the next stage
    const allowedStatuses = ['ACCEPTED', 'REJECTED'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Status must be either ACCEPTED or REJECTED."
        });
    }

    // 1. Update SHIPMENT table
    const updateShipmentQuery = `
        UPDATE SHIPMENT
        SET STATUS = ?
        WHERE ID = ?
    `;

    db.run(updateShipmentQuery, [status, shipmentId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error updating shipment." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Shipment not found." });
        }

        // 2. Log into STATUSHISTORY
        const insertHistoryQuery = `
            INSERT INTO STATUSHISTORY (SHIPMENTID, STATUS, MESSAGE, TIMESTAMP)
            VALUES (?, ?, ?, datetime('now'))
        `;

        db.run(insertHistoryQuery, [shipmentId, status, message], function (err2) {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ message: "Error logging status history." });
            }

            return res.status(200).json({
                message: "Shipment status updated and history logged."
            });
        });
    });
};



module.exports = {
    getAllShipments,
    updateShipmentStatus
};


