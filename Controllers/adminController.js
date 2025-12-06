const { db } = require('../Models/db.js');


// ====================================
// GET ALL SHIPMENTS (ADMIN ONLY)
// ====================================
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



// ====================================
// APPROVE SHIPMENT
// ====================================
const approveShipment = (req, res) => {
    const shipmentId = req.params.id;

    const query = `
        UPDATE SHIPMENT
        SET STATUS = 'APPROVED'
        WHERE ID = ?
    `;

    db.run(query, [shipmentId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error approving shipment." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Shipment not found." });
        }

        return res.status(200).json({ message: "Shipment approved." });
    });
};



// ====================================
// REJECT SHIPMENT
// ====================================
const rejectShipment = (req, res) => {
    const shipmentId = req.params.id;

    const query = `
        UPDATE SHIPMENT
        SET STATUS = 'REJECTED'
        WHERE ID = ?
    `;

    db.run(query, [shipmentId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error rejecting shipment." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Shipment not found." });
        }

        return res.status(200).json({ message: "Shipment rejected." });
    });
};


// ====================================
// UPDATE SHIPMENT STATUS (AND LOG HISTORY)
// ====================================
const updateShipmentStatus = (req, res) => {
    const shipmentId = req.params.id;
    const { status, message } = req.body;

    if (!status || !message) {
        return res.status(400).json({ message: "Status and message are required." });
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
    approveShipment,
    rejectShipment,
    updateShipmentStatus
};



















/*
const db_access = require('../db.js');
const db = db_access.db;



//  get all shipments
function getAllShipments(req, res) {
    db.all(`SELECT * FROM SHIPMENT`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(rows);
    });
}

// approve shipment
function approveShipment(req, res) {
    const shipmentId = req.params.id;

    db.run(
        `UPDATE SHIPMENT SET STATUS = 'APPROVED' WHERE ID = ?`,
        [shipmentId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Shipment approved' });
        }
    );
}

// reject shipment
function rejectShipment(req, res) {
    const shipmentId = req.params.id;

    db.run(
        `UPDATE SHIPMENT SET STATUS = 'REJECTED' WHERE ID = ?`,
        [shipmentId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Shipment rejected' });
        }
    );
}

//  update shipment status (e.g., "In Transit", "Delivered")
function updateShipmentStatus(req, res) {
    const shipmentId = req.params.id;
    const { status } = req.body;

    db.run(
        `UPDATE SHIPMENT SET STATUS = ? WHERE ID = ?`,
        [status, shipmentId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Shipment status updated' });
        }
    );
}



module.exports = {
    getAllShipments,
    approveShipment,
    rejectShipment,
    updateShipmentStatus,
};
*/