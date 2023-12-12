const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    product_id:{
        type:String,
        required:true
    },
    buyer_id:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        required:true
    }
});

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = {OrderModel};