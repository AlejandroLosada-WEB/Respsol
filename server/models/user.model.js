const mongoose=require('mongoose');
const { Schema } = mongoose;

const userSchema=new Schema({
    _id:{type:String},
    email:{type:String},
    password:{type:String},
    name:{type:String},
    active:{type:Boolean},
    photoProfile:{type:String},
});

module.exports = mongoose.model('user',userSchema);
