var mongoose = require('mongoose');

var activity = {
    name: String,
    value: Number,
    timesCompleted: Number,
    maxTimes: Number
}

module.exports = mongoose.model("Activitys", activity);