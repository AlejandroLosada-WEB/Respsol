const mongoose=require('mongoose');
const { Schema } = mongoose;

const photosSchema=new Schema({
    _id:{type:String},
    _id_user:{type:String},
    path:{type:String},
});

module.exports = mongoose.model('photos',photosSchema);
