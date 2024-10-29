import mongoose from "mongoose";

const userSchema= new mongoose.Schema(
    {
    Name: {
        type: String,
        require: true,

    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,

    },
    password: {
        type: String,
        require: [true,'Password is required']

    },
    role :{
        type: String,
        enum: ['customer', 'admin'], default: 'customer',
    },
    address: {
        type:String,
        require:true,
    },

    
        timestamp:true,
    

})

export const User = mongoose.model("User", userSchema)