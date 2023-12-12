const {UserModel} = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {roles} = require('../config/rolesConfig');
const fsPromise = require('fs').promises;
const path = require('path');

const createUser = async (req, res) =>{
    try{
        const match = await UserModel.findOne({email:req.body.email}).exec();
        if(match){
            res.status(400).json({'status':"FAILED",'message':"Email already Exists"});
            return;
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            name:req.body.name,
            email:req.body.email,
            mob:req.body.mob,
            image:"/images/"+req.file.filename,
            role:5001,
            password:hash
        });
        const result = await user.save();
        const safeData = {
            user_id:result._id,
            name:result.name,
            email:result.email,
            mob:result.mob,
            image:result.image,
            role:findKey(roles, result.role),
        } 

        res.status(200).json({success:true,"message":"User Created.", data:safeData});

    } catch (error) {
        res.status(400).json({success:true,"message":"Failed", "error":error})
    }
}

const getUserById = async (req, res) => {
    try{
        const match = await UserModel.findOne({_id:req.body.user_id});
        if(match){
            res.status(200).json({success:true, data:match});
        } else {
            res.status(400).json({success:false, message:"Cant find the user"})
        }
    }catch(err){
        res.status(400).json({success:true,"message":"Failed", "error":error})
    }
}

const getAllUsers = async (req, res) =>{
    try{
        const users = await UserModel.find().exec();
        //create an array without passwords
        const safeData = users.map(user=>({
            user_id:user._id,
            name:user.name,
            email:user.email,
            mob:user.mob,
            image:user.image,
            role:findKey(roles,user.role),
        })) 
        res.status(200).json({success:true,safeData});
    } catch (err) {
        res.status(400).json({success:true,"message":"FAILED", "error":err});
    }
}

const updateUserById = async (req, res) => {
    // updating will require user_id and also the password of that user.
    try{
        const match = await UserModel.findOne({_id : req.body.user_id}).exec();
        if(match){  
            if(await bcrypt.compare(req.body.password, match.password)){
                const obj = {
                    name: req.body.name ? req.body.name : match.name,
                    email: req.body.email ? req.body.email : match.email,
                    mob: req.body.mob ? req.body.mob : match.mob,
                    image: req.file ? "/images/"+req.file.filename : match.image,
                }
                // if image is updating take the old image name and delete it.
                if(req.file){
                    //delete old image
                    await fsPromise.rm(path.join(__dirname,'..','public',match.image));
                }
                const result = await UserModel.updateOne({_id:req.body.user_id},{
                    $set: obj
                }, {new:true});
                res.status(200).json({success:true,"message":"SUCCESS", "data":result});
            } else {
                res.status(403).json({success:false,"message":"FAILED. Password Incorrect"});
            }
        } else {
            res.status(400).json({success:false,"message":"FAILED. User Id Does Not Exist."});
        }

    } catch (err) {
        res.status(400).json({success:false,"message":"FAILED", "error":err});
    }
}

const deleteUserById = async (req, res) =>{
    try{
        const match = await UserModel.findOne({_id: req.body.user_id});
        if(await bcrypt.compare(req.body.password, match.password)){
            if(match){
                await fsPromise.rm(path.join(__dirname,'..','public',match.image));
                const result = await UserModel.deleteOne({_id:req.body.user_id});
                res.status(200).json({success:true,"message":"SUCCESS", "data":result});
            } else {
                res.status(400).json({success:false,"message":"User Does Not Exist."});
            }
        } else {
            res.status(403).json({success:false,"message":"Password Incorrect."})
        }
    } catch (err){
        res.status(400).json({success:false,"message":"FAILED"});
    }
}

const changeUserPassword = async (req, res) => {
    try{
        // we need the user id and correct password.
        const match = await UserModel.findOne({_id:req.body.user_id}).exec();
        if( await bcrypt.compare(req.body.password, match.password)){
            if(req.body.newPassword === req.body.newPasswordRepeat){
                const hash = await bcrypt.hash(req.body.newPassword, 10);
                const result = await UserModel.updateOne({_id:req.body.user_id},{password:hash});
                res.status(200).json({success:true, "message":"Password Changed Successfully", data:result})
            } else {
                res.status(400).json({success:false, "message":"New Passwords Dont Match"});
            }
        } else{
            res.status(400).json({success:false, "message":"Please Enter Correct Current Password"})
        }
    } catch(err){
        res.status(400).json({success:false,"message":"FAILED"});
    }
}

const handleLogin = async (req, res) => {
    try{
	console.log(req.body);
        const match = await UserModel.findOne({name:req.body.name});
        if(match){
            if(await(bcrypt.compare(req.body.password, match.password))){
                const accessToken = jwt.sign({name:match.name, role:match.role}, process.env.JWTACCESSTOKENKEY,{expiresIn:'1d'});
                const safeData = {
                    access_token:accessToken,
                    user_id:match._id,
                    name:match.name,
                    email:match.email,
                    mob:match.mob,
                    image:match.image,
                    role:findKey(roles, match.role),
                }
                await UserModel.updateOne({_id:match._id},{accessToken})
                res.status(200).json({success:true, loggerData:safeData})
            } else {
                res.status(400).json({success:false, "message":"Username and/or Password incorrect."});
            }
        }else{
            res.status(400).json({success:false, "message":"Username and/or Password incorrect."});
        }
    } catch(err){
        res.status(400).json({success:false, "message":"FAILED"})
    }
}

function findKey(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

module.exports = {createUser, getAllUsers, updateUserById, deleteUserById, changeUserPassword, handleLogin, getUserById};
