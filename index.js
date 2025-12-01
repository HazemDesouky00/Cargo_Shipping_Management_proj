const express = require('express');
const app = express();

const adminRouter = require('./routes/adminRouter');
const authRouter = require('./routes/authRouter');
const shipmentRouter = require('./routes/shipmentRouter');
const userRouter = require('./routes/userRouter');


const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/shipments', shipmentRouter);
app.use('/admin', adminRouter);

module.exports = { app };
