const {broadcastModel} = require('../models/broadcastModel');
const { UserModel } = require("../models/userModel");

const broadcastAssignedTask = async (req, res) => {
    try {
        const broadcaster = await UserModel.findOne({_id: req.body.broadcaster_id});
        if(broadcaster){
            console.log('BROADCASTER', broadcaster);
            if(broadcaster.role === 5003 && req.role === 5003){
                // Making Sure only admins can broadcast
                const broadcast = new broadcastModel({
                    assigned_by: {
                        name: broadcaster.name,
                        image: broadcaster.image,
                        user_id: broadcaster._id,
                        email: broadcaster.email,
                    },
                    description: req.body.description,
                    due_date: req.body.due_date,
                });
                const result = await broadcast.save();
                res.status(201).json({success:true, message:'broadcast created.', result});
            } else {
                res.status(403).json({success:false, message:'FORBIDDEN. Only admins can broadcast.'});
            }
        } else {
            res.status(400).json({success:false, message:'Cannot Find User'})
        }

    } catch (error) {
        res.status(400).json({success:false, message:'FAILED'})
    }
}

const deleteBroadcast = async (req, res) => {
    try {
        if(req.role === 5003){
            const result = await broadcastModel.findByIdAndDelete({_id:req.body.broadcast_id});
            res.status(200).json({success:true, message:'Broadcast Deleted.', result});
        } else{
            res.status(403).json({success:false, message:'FORBIDDEN. Only admins can broadcast.'});
        }
    } catch (error) {
        res.status(400).json({success:false, message:'FAILED'})
    }
}

const getBroadcast = async (req, res) => {
    try {
        const match = await broadcastModel.find({});
        if(match){
            res.status(200).json({success:true, data:match});
        } else {
        res.status(400).json({success:false, message:'Cant get broadcasts.'})
        }
    } catch (error) {
        res.status(400).json({success:false, message:'FAILED'})
    }
}

module.exports = {broadcastAssignedTask, deleteBroadcast, getBroadcast}
