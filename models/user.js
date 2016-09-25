var mongoose = require('mongoose');

var user = {
    username: String,
    password: String,
    email: String,
    allowance: Number
};

module.exports = mongoose.model("Users", user);