const jwt = require('jsonwebtoken'); // that gets stored on the client side 



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
        return res.status(403).json({ message: "Admin access required. Access denied: Admins only" });
    }
    next();
};


module.exports = {
    
    verifyToken,
    requireAdmin
};
