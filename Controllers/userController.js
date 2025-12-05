const { db } = require('../db.js');
const bcrypt = require('bcryptjs');


//get user profile
const getUserProfile = (req, res) => {
    const userId = req.user.id;   // <-- comes from verifyToken middleware 

    const query = `SELECT ID, NAME, EMAIL, ROLE FROM USER WHERE ID = ?`;

    db.get(query, [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error." });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ user });
    });
};


//to update user profile
const updateUserProfile = (req, res) => {
    const userId = req.user.id;   
    const { name, email, password } = req.body;

    // Build dynamic update query
    let updateFields = [];
    let params = [];

    if (name) {
        updateFields.push("NAME = ?");
        params.push(name);
    }

    if (email) {
        updateFields.push("EMAIL = ?");
        params.push(email);
    }

    if (password) {
        const hashed = bcrypt.hashSync(password, 10);  
        updateFields.push("PASSWORDHASH = ?");
        params.push(hashed);
    }

    // No fields to update
    if (updateFields.length === 0) {
        return res.status(400).json({ message: "No fields to update." });
    }

    params.push(userId);

    const query = `
        UPDATE USER 
        SET ${updateFields.join(', ')}
        WHERE ID = ?
    `;

    db.run(query, params, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error during update." });
        }

        return res.status(200).json({ message: "Profile updated successfully." });
    });
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
