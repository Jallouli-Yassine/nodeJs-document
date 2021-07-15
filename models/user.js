const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    firstname :{
        type : String,
        require : true
    },
    lastname :{
        type : String,
        require : true
    },
    email :{
        type : String,
        require : true,
        unique: true,
    },
    password :{
        type : String ,
        require : true
    },
    role :{
        type : String,
    }
})

const User = mongoose.model("user",userScheme);

module.exports=User;