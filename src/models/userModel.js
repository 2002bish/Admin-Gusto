import mongoose from "mongoose";
import {bcrypt} from "bcryptjs";
const userSchema= new mongoose.Schema(
    {
    userName: {
        type: String,
        require: true,
        unique: true,

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
    

});

//hashing password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema)