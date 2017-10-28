const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(database);

var CountrySchema = new Schema({
    country_id  : {type:Number, unique:true, required:true},
    country_name : {type:String, required:true},

});

var Country = mongoose.exports = mongoose.model("Bot", CountrySchema);
