import mongoose from "mongoose";


const  UserSchema = new mongoose.Schema({
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

const User = mongoose.models.UserSchema || mongoose.model('User', UserSchema);
export default User;

