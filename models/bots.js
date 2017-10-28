const mongoose = require('mongoose');
const Schema = mongoose.Schema;




var BotsSchema = new Schema({
    bot_id  : {type:Number, unique:true, required:true},
    bots_name : {type:String, required:true},
    profile_pic : {type:String, required:true},
    country : {type:String, required:true},
    category: {type:String, require:true},
    developer: {type:String, required:true},
    description: {type:String, required:true},
    scan_code: {type:String, required:true}
});

var Bot = mongoose.exports = mongoose.model("Bot", BotsSchema);

