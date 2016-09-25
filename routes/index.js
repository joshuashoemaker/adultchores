//Dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//-------------------------------Models-------------------------------
var Activity = require('../models/activity');
var User = require('../models/user');


//-------------------------------Routes-------------------------------
//--------------------------------------------------------------------

//Index Router
router.get("/", function(req, res, next){
    
    //Logic Variables
    var allowance = 35;
    var allowanceUsed = 0;
    var allowanceRemaining = 0;
    var percentUsed = 0;
    var percentageRemaining = 0;
    var resBody = {};


    console.log('You made it to the index router.');

    //Get User Info
    var query  = User.where({ username: "JShoemakerDev" });
    query.findOne(function(err, user){
        if(err) {
            console.log(err);
        }
        else {
            allowance = user.allowance;
        }
    });

    //Get Users
    var activities;
    Activity.find(function(err, data) {
        if(err)console.log(err, data);

        activities = data;
        addValues();
    });


    function addValues(){
        allowanceUsed = 0;
        var val = 0;
        
        activities.forEach(function(activity) {

            var timesComp = Number(activity.timesCompleted);
            var actVal = Number(activity.value);
            var maxTimes = Number(activity.maxTimes);

            if(activity.timesCompleted < activity.maxTimes){
                val = timesComp * actVal;
            }
            else{
                val = maxTimes * actVal;
            }
                allowanceUsed = allowanceUsed + val;
        }, this);

        allowanceRemaining = allowance - allowanceUsed;
        
        if(allowanceUsed > allowance){
            allowanceUsed = allowance;
            percentUsed = 100;
            resBody = {
                data: {
                    graphData: {
                        completed: allowance,
                        uncompleted: 0,
                        percent: 100,
                        allowance: allowance
                    },
                    activityData: activities
                }
            };
            res.json(resBody);
        }
        else{
            percentUsed = roundUp((allowanceUsed/allowance) * 100, 10);
            percentageRemaining = 100 - percentUsed;
            resBody = {
                data: {
                    graphData: {
                        completed: allowanceUsed,
                        uncompleted: allowanceRemaining,
                        percent: percentUsed,
                        allowance: allowance
                    },
                    activityData: activities
                }
            };
            res.json(resBody);
        }
    }
});

function roundUp(number, precision) {
  return Math.ceil(number * precision) / precision;
}

router.post("/", function(req, res, next){
  console.log('You posted something to the index router. How did you do that? There is no post form!')
});
//-------------------------------------


//New Activity Router
router.post("/newActivity", function(req, res, next){
    var activity = new Activity();
    var existingAct;

    activity.name = req.body.name;
    activity.value = req.body.value;
    activity.timesCompleted = 0;
    activity.maxTimes = req.body.maxTimes;

    var query  = Activity.where({ name: activity.name });

    query.findOne(function(err, data){
        if(err) console.log(err)
        else existingAct = data;
        console.log(existingAct);

        if(!existingAct){
            activity.save(function(err, activity){
                if(err) {
                    console.log(err);
                }
                else{
                    console.log('saved');
                    res.json('saved');
                }
            });
        }
        else console.log("Already Exists");
    })

});
//----------------------------

//Delete Activity By Name Route
router.post("/deleteActivity", function(req, res, next){

    Activity.findOneAndRemove({ name: req.body.name }, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('Removed');
            res.json('Removed');
        }
    })
});
//----------------------------

//Add and Subtract Times Completed
router.post('/timesCompleted', function(req, res, next){

    var newNum = 0;

    Activity.findOneAndUpdate({ name: req.body.name }, { timesCompleted: getNewNumber(req.body) }, function(err, activity){
        if(err)
            console.log(err);
        else{
            console.log("Updated");
        }
    });

    function getNewNumber(obj){
        if(isNaN(obj.timesCompleted)){
            newNum = Number(obj.timesCompleted);
        }
        else{
            newNum = obj.timesCompleted;
        }

        if(obj.math === 'add'){
            newNum++;
        }
        else{
            newNum--;
        }
        return newNum;
    }
    res.json(newNum);
});
//-------------------------------


//---Update Allowance Ammount----
router.post('/updateAllowance', function(req, res, next){
    User.findOneAndUpdate({ username: 'JShoemakerDev' }, { allowance: req.body.allowance }, function(err, user){
        if(err)
            console.log(err);
        else{
            console.log(user);
            console.log("Updated");
            res.json("Updated");
        }
    });
});


//-----------Seed Project---------
router.get('/seed', function(req, res){

    var seedUser = new User({ 
        username: 'JShoemakerDev' ,
        password: 'AintNoThang',
        allowance: 40
    });
    seedUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Seeded User');
            res.json('Seeded User');
        }
    });
});

module.exports = router;