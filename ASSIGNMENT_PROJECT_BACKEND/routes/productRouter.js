const path = require('path');
const express = require('express');
const productRouter = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');


const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, path.join(__dirname,'../public/productImages'), (error, success)=>{
            if(error){
                console.log("Error in Product Router",error);
            }
        });
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname, (error, success)=>{
            if(error){
                console.log("Error in Product Router",error);
            }
        });
    }
});

const upload = multer({storage:storage});
productRouter.post('/add-product', upload.array('images', 5),productController.addProduct);
productRouter.post('/get-products', productController.getProductsByCreatorId);
productRouter.post('/delete-product', productController.deleteProduct);
productRouter.post('/update-product', upload.array('images', 5),productController.updateProductById);


module.exports = {productRouter};