const express = require('express');
const { register, login } = require('../Controllers/authController');
//const { validateSignup, validateLogin   } = require ('../Utils/Validators')
const authRouter = express.Router();


// Route for user login
authRouter
.post('/login', login);//then put validatelogin here 

// Route for user signup
authRouter
.post('/signup', register);// and validate signup here after testing is done 


module.exports = authRouter;
