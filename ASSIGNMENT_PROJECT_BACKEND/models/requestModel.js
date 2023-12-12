const mongoose = require('mongoose');

const RequestDataSchema = new mongoose.Schema({
    
        request_type:{
            type:String,
            required:true
        },
        raised_on:{
            type:String,
            required:true
        },
        approved:{
            type:Boolean,
            required:true,
            default:false
        },
        date_data:{
            total_days:{
                type:Number,
                required:false,
            },
            start_date:{
                type:String,
                required:false
            },
            end_date:{
                type:String,
                required:false
            }
        },
        documents:{
            type:Array,
            required:false,
            validation:[function(value){ return value.length <= 5}, "Can only upload a maximum of 5 documents."]
        }
    
}); 

const RequestSchema = new mongoose.Schema({
    raised_by:{
        type:String,
        required:true
    },
    request_data:[RequestDataSchema]
});

const requestModel = mongoose.model('Request', RequestSchema);

module.exports = {requestModel};

