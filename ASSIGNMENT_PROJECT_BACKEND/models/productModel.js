const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    creator_id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images:{
        type:Array,
        required:false,
        validate:[function(value){ return value.length <= 5; }, "You can add only 5 product images."]
    },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = {ProductModel};