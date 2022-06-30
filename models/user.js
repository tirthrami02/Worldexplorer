const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String ,
        required : true,
        unique : true ,
    }
});
 userSchema.plugin(passportLocalMongoose);

 module.exports = mongoose.model('User' , userSchema);