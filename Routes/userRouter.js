const express = require('express');
const { getUserProfile, updateUserProfile } = require('../Controllers/userController');
const { verifyToken } = require('../Middleware/authMiddleware');
const { validateUserUpdate } = require('../Utils/Validators');

const userRouter = express.Router();

// GET /users/me    must be logged in
userRouter.get('/me', verifyToken, getUserProfile);

// PUT /users/me    must be logged in + data validated
userRouter.put('/me',verifyToken,validateUserUpdate,updateUserProfile);

module.exports = userRouter;
