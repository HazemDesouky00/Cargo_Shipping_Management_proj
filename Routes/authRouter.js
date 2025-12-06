const express = require('express');
const { register, login } = require('../Controllers/authController');

const authRouter = express.Router();


// Route for user login
authRouter
.post('/login', login);

// Route for user signup
authRouter
.post('/signup', register);


module.exports = authRouter;
