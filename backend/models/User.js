const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname : {
        required : true,
        type : String,
        trim: true
    },
    username : {
        unique: true,
        trim: true,
        required : true,
        type : String
    },
    email : {
        lowercase: true,
        trim: true,
        type: String,
        required: [true, "Please add your email"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password : {
        required : true,
        type : String,
        minLength: 6,
    }
}, { timestamps: true });

module.exports = mongoose.model("User",userSchema);