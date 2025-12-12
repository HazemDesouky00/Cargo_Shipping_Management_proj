const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors =  require('cors');

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5500", // port number of front end 
    credentials: true  
}))

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
