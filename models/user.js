// user model will consist of 3 basic thing- name ,email and password
const mongoose =require("mongoose");
const Schema  = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default;

//---------------------------------------
// creating user schema
//--------------------------------------

const userSchema = new Schema({
     email:{
        type:String,
        required:true
     }
// here the fields of password and userame will be automatically defned 
// by passport-local-mongoose so we don't need to define it ourself
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);