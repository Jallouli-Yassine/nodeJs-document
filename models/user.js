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
    phone : {
        type : Number,
        require : true
    },
    role :{
        type : String,
    },
})

const User = mongoose.model("user",userScheme);

module.exports=User;