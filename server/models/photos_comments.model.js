const mongoose=require('mongoose');
const { Schema } = mongoose;

const photos_commentsSchema=new Schema({
_id:{type:String},
_id_photo:{type:String},
_id_user_photo:{type:String},
_id_user_comment:{type:String},
name_user_comment:{type:String},
path_avatar_user_comment:{type:String},
fecha:{type:String},
hora:{type:String},
date:{type:Date},
comment:{type:String},
});

module.exports = mongoose.model('photos_comments',photos_commentsSchema);
