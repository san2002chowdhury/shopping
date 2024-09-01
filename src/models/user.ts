import { trim } from "lodash";
import { Schema,model } from "mongoose";
const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        maxlenght:30,   
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    phone:{
        type:String,
        maxlength: 10,
		required: true,
    },
    role:{
        type: String,
        required:true,
        enum : ['user','admin'],
        default: 'user'
    },
    fname:{
        type:String,
        require:true,
    },
    mname:{
        type:String,
    },
    lname:{
        type:String,
        require:true,
    },
    address:{
        type:String,
    }
},{timestamps:true});
export const UserModel=model('users',UserSchema);