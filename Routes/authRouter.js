const express = require('express');
const { register, login } = require('../Controllers/authController');

const router = express.Router();


// Route for user login
router.post('/login', login);

// Route for user signup
router.post('/signup', register);


module.exports = authRouter;
