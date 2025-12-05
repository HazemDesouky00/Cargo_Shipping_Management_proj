const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db.js');

// function for JWT
const signToken = (userId, role) =>
     {return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

//signup
const register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide name, email and password." });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error hashing password." });
        }

        const query = `
            INSERT INTO USER (NAME, EMAIL, PASSWORDHASH, ROLE)
            VALUES (?, ?, ?, 'USER')
        `;

        db.run(query, [name, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({ message: "Email already exists." });
                }
                console.error(err);
                return res.status(500).json({ message: "Database error." });
            }

            return res.status(201).json({
                message: "User registered successfully.",
                userId: this.lastID
            });
        });
    });
};

//login
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    const query = `SELECT * FROM USER WHERE EMAIL = ?`;

    db.get(query, [email], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error." });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare password
        bcrypt.compare(password, user.PASSWORDHASH, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error verifying password." });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password." });
            }

            // Create JWT
            const token = signToken(user.ID, user.ROLE);
            //for cookie
            res.cookie ('jwt',token, {
                httppOnly:true,
                secure: process.env.NODE_ENV ==='production',
                samSite: 'lax',
                maxAge:60*60*1000,
            } );

            return res.status(200).json({
                message: "Login successful.",
                user: {
                    id: user.ID,
                    name: user.NAME,
                    email: user.EMAIL,
                    role: user.ROLE
                },
                token
            });
        });
    });
};



// VERIFY TOKEN MIDDELWARE 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};


//requiring admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Admin access required." });
    }
    next();
};


module.exports = {
    register,
    login,
    verifyToken,
    requireAdmin
};
