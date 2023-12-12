const {OrderModel} = require('../models/orderModel');

const createOrder = async (req, res) => {
    try{
        if(!req.body.buyer_id || !req.body.product_id){
            res.status(400).json({success:false, "message":"Buyer_Id and / or Product Id are required."});
        } else {
            const match = await OrderModel.findOne({buyer_id:req.body.buyer_id, product_id:req.body.product_id}).exec();
            if(match){
                const result = await OrderModel.updateOne({buyer_id:req.body.buyer_id, product_id:req.body.product_id}, {count:match.count+1});

                res.status(200).json({success:true, "message":"Order Created", data:result});
            } else {
                console.log("else Block");
                console.log(req.body);
                const Order = new OrderModel({
                    product_id:req.body.product_id,
                    buyer_id:req.body.buyer_id,
                    count:1
                });

                const orderData = await Order.save();
                res.status(200).json({success:true, "message":"Order Created", data:orderData});
            }
        }

    }catch(err){
        res.status(400).json({success:false, "message":"FAILED"});
    }
}

const getOrdersByBuyerId = async (req, res) => {
    try{
        if(!req.body.buyer_id){
            res.status(400).json({success:false, "message":"Buyer Id is Required"});
        } else {
            const result = await OrderModel.find({buyer_id:req.body.buyer_id}).exec();
            if(result.length !== 0){
                res.status(200).json({success:true, "message":"Orders Data Received", data:result});
            } else {
                res.status(400).json({success:false, "message":"Cannot Find Buyer"});
            }
        }
    }catch(err){
        res.status(400).json({success:false, "message":"FAILED"});
    } 
}


module.exports = {createOrder, getOrdersByBuyerId}