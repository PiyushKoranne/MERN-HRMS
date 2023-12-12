const mongoose = require('mongoose');

const TaskDataSchema = new mongoose.Schema({
    assigned_by:{
        name:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        user_id:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },
    description:{
        type:String,
        required:true
    },
    due_date:{
        type:String,
    },
    priority:{
        type:Number,
        required:true,
        default:3
    },
    completed:{
        type:Boolean,
        required:true,
        default:false
    },
});
const SelfTaskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    due_date:{
        type:String,
    },
    priority:{
        type:Number,
        required:true,
        default:3
    },
    completed:{
        type:Boolean,
        required:true,
        default:false
    }
})

const TaskSchema = new mongoose.Schema({
    assigned_tasks:[TaskDataSchema],
    self_tasks:[SelfTaskSchema],
    user_id:{
        type:String,
        required:true
    },

});

const TaskModel = mongoose.model("Task", TaskSchema);
const AssignedTaskModel = mongoose.model('Assigned_Task', TaskDataSchema);
module.exports = {TaskModel, AssignedTaskModel};
