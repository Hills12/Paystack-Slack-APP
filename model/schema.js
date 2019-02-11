const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userSchema = new Schema({
    UserId : String,
    email: String,
    password: String
})

exports.User = mongoose.model("User", userSchema);