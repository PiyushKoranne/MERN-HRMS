const {ProductModel} = require('../models/productModel');

const addProduct = async (req, res) => {
    try{
        const match = await ProductModel.findOne({name:req.body.name}).exec();
        if(match){
            res.status(400).json({"message":"Product already exists in the DB."})
        }
        else {
            const imagesArray = [];
            if(req.files){
                for(let i=0; i<req?.files?.length; i++){
                    imagesArray.push('/productImages/'+req.files[i].filename);
                }
            }
            const product = new ProductModel({
                creator_id:req.body.creator_id,
                name:req.body.name,
                price:req.body.price,
                images:imagesArray 
            });
            const productData = await product.save();
            res.status(201).json({"message":"SUCCESS", "data":productData});
        }
    } catch (err){
        res.status(400).json({"message":"FAILED"})
    }
}

const getProductsByCreatorId = async (req, res) =>{
    try{
        const match = await ProductModel.findOne({creator_id:req.body.creator_id}).exec();
        if(!match){
            res.status(400).json({"message":"FAILED. Cannot Find User Id", success:false});
        } else{
            const products = await ProductModel.find({creator_id:req.body.creator_id}).exec();
            res.status(200).json({success:true,"message":"SUCCESS", data:products});
        }
    } catch(err){
        res.send(400).json({success:false, "message":"FAILED"});
    }
}

const updateProductById = async (req, res) => {
    try{
        const match = await ProductModel.findOne({_id:req.body.product_id}).exec();
        if(!match){
            res.status(400).json({success:false, "message":"Cannot Find Product Id."})
        } else {
            let arrImages = [];
            if(req.files.length > 0){
                req.files.forEach(item=>{arrImages.push("/productImages/"+item.filename)});
            }
            let obj = {
                name: req.body.name ? req.body.name : match.name,
                price:req.body.price? req.body.price: match.price,
                images:arrImages.length >0 ? arrImages : match.images
            }
            console.log(req.files)
            const result = await ProductModel.updateOne({_id:req.body.product_id}, obj);
            res.status(200).json({success:true, "message":"Product Updated Successfully", data:result});
        }
        
    }catch(err){
        res.send(400).json({success:false, "message":"FAILED"});
    }
}

const deleteProduct = async (req, res) =>{
    try{
        const match = await ProductModel.findOne({_id:req.body.product_id}).exec();
        if(!match){
            res.status(400).json({success:false, "message":"Cannot find the product id."});
        } else {
            const result = await ProductModel.deleteOne({_id:req.body.product_id});
            res.status(200).json({success:true, message:"Deleted Product", data:result});
        }
    } catch(err){
        res.status(400).json({success:false, "message":"FAILED"});
    }
}


module.exports = {addProduct, getProductsByCreatorId, updateProductById, deleteProduct};