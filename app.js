//Module Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use('/', require('./routes/index'));

//Connect to Remote Database
if(mongoose.connect('mongodb://jshoemakerdev:AintNoThang@ds147965.mlab.com:47965/adultchores')){
    console.log('Connected to Remote Database');
}
else{
    console.log("Could not connect to Remote Database");
}

app.listen(3000);
console.log('API is on Port 3000');


