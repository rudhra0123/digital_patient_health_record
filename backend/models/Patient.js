const mongoose=require('mongoose');
const patientSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('Patient',patientSchema);