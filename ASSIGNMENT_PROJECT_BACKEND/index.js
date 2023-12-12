// Write Your Code here 
const express = require('express');
const mongoose = require('mongoose');
const server = express();
require('dotenv').config();
const cors = require('cors');
const { corsOptions } = require('./config/corsConfig');
const {userRouter} = require('./routes/userRouter');
const {connectDB} = require('./config/dbConn');
const { productRouter } = require('./routes/productRouter');
const { orderRouter } = require('./routes/orderRouter');
const {taskRouter} = require('./routes/taskRouter');
const { requestRouter } = require('./routes/requestsRouter');
const {broadCastRouter} = require('./routes/broadcastRouter');
const PORT = process.env.PORT || 3002;

// connecting to MongoDB
connectDB();

// setting up cors and other middlewares
server.use(cors(corsOptions));

// NOTE : I dont think the two middlewares below i.e json & urlencoded is required since we are using multer.
//        I have to check on this.
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.use(express.static('public'));

// Routers 
server.use('/api', userRouter);
server.use('/api', productRouter);
server.use('/api', orderRouter);
server.use('/api', taskRouter);
server.use('/api', requestRouter);
server.use('/api', broadCastRouter);

// server listening
mongoose.connection.once('connected', ()=>{
    console.log('Connected to MongoDB');
    server.listen(PORT, ()=>{
        console.log(`Listening for connections on PORT ${PORT}`);
    })
})


