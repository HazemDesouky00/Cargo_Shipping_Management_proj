const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Routers
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');
const shipmentRouter = require('./Routes/shipmentRouter');
const adminRouter = require('./Routes/adminRouter');
const statusHistoryRouter = require('./Routes/statusHistoryRouter');

// Middleware
app.use(express.json());
app.use(cookieParser());

// Route mounting n usage
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/shipments', shipmentRouter);
app.use('/admin', adminRouter);
app.use('/history', statusHistoryRouter);

module.exports = { app };
