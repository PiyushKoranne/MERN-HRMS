const {requestModel} = require('../models/requestModel');
const { parseISO, differenceInBusinessDays } = require('date-fns');

const makeRequest = async (req, res) => {
    try{
        console.log(req.body.request_type);
        const match = await requestModel.findOne({raised_by:req.body.raised_by});
        if(match){
            
            console.log('match', match)
            if(match?.request_data.length >= 5){
                res.status(403).json({success:false, 'message':'Cannot make more that 5 requests per day.', limitExceed:true});
            } else {
                const arr = [];
                for(let i=0; i<req.files.length; i++){
                    arr.push('/requestImages/'+req.files[i].filename);
                }
                console.log('arr', arr);
                const days = differenceInBusinessDays(parseISO(req.body.end_date), parseISO(req.body.start_date));
                match.request_data.push({
                    request_type:req.body.request_type,
                    raised_on:req.body.raised_on,
                    date_data:{
                        total_days:days,
                        start_date:req.body.start_date,
                        end_date:req.body.end_date
                    },
                    documents: arr
                });
                const response = await match.save();
                console.log('response',response);
                res.status(201).json({success:true, 'message':'request created', response});
            }
        } else {
            const arr = [];
            for(let i=0; i<req.files.length; i++){
                arr.push('/requestImages/'+req.files[i].filename);
            }
            const days = differenceInBusinessDays(parseISO(req.body.end_date), parseISO(req.body.start_date));
            const request = new requestModel({
                raised_by:req.body.raised_by,
                request_data:[{
                    request_type:req.body.request_type,
                    raised_on:req.body.raised_on,
                    date_data:{
                        total_days:days,
                        start_date:req.body.start_date,
                        end_date:req.body.end_date
                    },
                    documents:arr   
                }]
            });
            request.markModified('request_data');
            console.log(request);
            const response = await request.save();
            console.log(response);
            res.status(201).json({success:true, 'message':'request created', response});
        }

    } catch (err){
        res.status(400).json({success:false,'message':'FAILED', err})
    }
}

const getRequests =  async (req, res) =>{
    try {
        const match = await requestModel.findOne({raised_by:req.body.raised_by});
        if(match){
            res.status(200).json({success:true, data:match});
        }else{
            res.status(400).json({success:false,message:'Cannot find user.'});
        }
    } catch (error) {
        res.status(400).json({success:false,'message':'FAILED', err})
    }
}

const  getAllRequestsAdmin =  async (req, res) => {
    try {
        if(req.role === 5003){
            console.log('Getting all data...')
            const data = await requestModel.find({});
            console.log(data);
            res.status(200).json({success:true, data});
        } else {
            res.status(403).json({success:false, message:'FORBIDDEN. Only admins can access.'});
        }
    } catch (error) {
        res.status(400).json({success:false,'message':'FAILED', err})
    }
}

const deleteRequest = async (req, res) =>{
    try {

        if(req.role !== 5003){return res.status(403).json({success:false, message:'Not Authorized to delete request.'}); }
        const match = await requestModel.findOne({raised_by:req.body.raised_by});
        if(match){
            console.log('req.body', req.body, '\n');
            const updated = match.request_data.filter(item => (item._id.toString() !== req.body.request_id));
            console.log(updated);
            match.request_data = updated;
            const reponse = await match.save();
            res.status(200).json({success:true, message:'Request Deleted'});
        }else {
            res.status(400).json({success:false, message:'Request Not Found'});
        }
    } catch(err){
        res.status(400).json({success:false,'message':'FAILED', err})
    }
}

const approveRequest = async (req, res) => {
    try {
        if(req.role !== 5003){
            return res.status(403).json({success:false, message:'Not Authorized to approve'});
        } else {
            const match = await requestModel.findOne({raised_by:req.body.raised_by});
            if(match){
                match.request_data.forEach(item=>{
                    if(item._id.toString() === req.body.request_id){
                        item.approved = true;
                    }
                });
                await match.save();
                res.status(200).json({success:true, message:'Request Approved'});
            }else {
                res.status(400).json({success:false, message:'Request not found.'})
            }
        }
    } catch (error) {
        res.status(400).json({success:false,'message':'FAILED', error})
    }
}

module.exports = {makeRequest, deleteRequest, getRequests, approveRequest, getAllRequestsAdmin};