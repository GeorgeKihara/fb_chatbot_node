const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(database);

var CategorySchema = new Schema({
    category_id  : {type:Number, unique:true, required:true},
    category_name : {type:String, required:true},

});

var Category = mongoose.exports = mongoose.model("Bot", CategorySchema);
