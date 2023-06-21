import mongoose from "mongoose";


const  CreaterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    },
    photoURL:{
        type:String,
        required:true
    }
})

const Creater = mongoose.models.CreaterSchema || mongoose.model('Creater', CreaterSchema);
export default Creater;

