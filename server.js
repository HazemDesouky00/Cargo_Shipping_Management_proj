const { app } = require ('./index');
const db_access = require ('./db.js');
const db = db_access.db;


const PORT = 3000;

db.serialize(() => {
    db.run(db_access.createUserTable, (err) => {
        if (err) console.log("Error creating User table:", err.message);
    });

    db.run(db_access.createShipmentTable, (err) => {
        if (err) console.log("Error creating Shipment table:", err.message);
    });

    db.run(db_access.createStatusHistoryTable, (err) => {
        if (err) console.log("Error creating StatusHistory table:", err.message);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
