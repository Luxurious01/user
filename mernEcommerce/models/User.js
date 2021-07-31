const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min: 3
    },
    lastName:{
        type:String,
        require:true,
        min:3
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true
        
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    contactNumber: { type:String},
    profilePicture:{ type:String}
})
mongoose.model("User",userSchema)