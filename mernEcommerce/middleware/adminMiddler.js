const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next) => {
    if(req.user.role !== 'admin'){
        return res.status(400).json({message : 'admin access denied'})
    }
    next();
}