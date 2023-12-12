const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () =>{
    const response = await mongoose.connect(process.env.MONGODB_CONNECT_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
}

module.exports = {connectDB}