const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(database);

var DeveloperSchema = new Schema({
    developer_id  : {type:Number, unique:true, required:true},
    developer_name : {type:String, required:true},
    country : {type:String, required:true},

});

var Bot = mongoose.exports = mongoose.model("Bot", BotsSchema);
