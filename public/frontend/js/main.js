
//=======================On Click Functions==========================

//Add To Activity
$(document).on('click', ".plusButton", function () {
    var act = {
        name: $(this).parent("div").parent('div').attr("data-name"),
        timesCompleted: $(this).parent("div").parent('div').attr("data-timesCompleted"),
        math: "add"
    };
    console.log(act);
    activityCompleted(act);    
});

//Subtract From Activity
$(document).on('click', ".minusButton", function () {
    let act = {
        name: $(this).parent("div").parent('div').attr("data-name"),
        timesCompleted: $(this).parent("div").parent('div').attr("data-timesCompleted"),
        math: "minus"
    };
    console.log(act);
    activityCompleted(act);
});

//Remove Activity
$(document).on('click', '.removeButton', function(){
    let act = $(this).parent("div").parent('div').attr("data-name");
    console.log(act);
    removeActivity(act);
});

//Add Activity
$(document).on('click', '#addActButton', function(){
    let act = {
        name: $('#activityName').val(),
        timesCompleted: 0,
        value: $('#activityValue').val(),
        maxTimes: $('#activityMaxTimes').val(),
    };
    console.log(act);
    addActivity(act);
})

//Update Allowance
$(document).on('click', '#updateButton', function(){
    let val =$('#updateAllowance').val();
    console.log(val);
    updateAllowance(val);
});

//-------------------------------------------------------------------


//========================Activity AJAX CALLS========================
function activityCompleted(act){
    $.ajax({
        type: "POST",
        url: "https://adultchores.herokuapp.com/timesCompleted",
        data: act,
        success: function(){
            location.reload();
        },
        dataType: "json"
    });
}

function removeActivity(act){
    $.ajax({
        type: "POST",
        url: "https://adultchores.herokuapp.com/deleteActivity",
        data: {
            name: act
        },
        success:  function(){
            location.reload();
        },
        dataType: "json"
    });
}

function addActivity(act){
    $.ajax({
        type: "POST",
        url: "https://adultchores.herokuapp.com/newActivity",
        data: act, 
        success:  function(){
            location.reload();
        },
        dataType: "json"

    });
}

function updateAllowance(val){
    $.ajax({
        type: "POST",
        url: "https://adultchores.herokuapp.com/updateAllowance",
        data: {
            allowance: val
        },
        success: function(){
            location.reload();
        },
        dataType: "json"
    })
}


//-------------------------------------------------------------------


//==========================Chart Creation===========================
const PIECHART = document.getElementById("pieChart");

    $.ajax({
        url: "https://adultchores.herokuapp.com/",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            console.log(result);

            var activityArr = result.data.activityData;

            let pieChart = new Chart(PIECHART, {
                type: 'doughnut',
                data: {
                    labels: [
                        "Completed",
                        "Uncompleted"
                    ],
                    datasets: [
                        {
                            data: [result.data.graphData.completed, result.data.graphData.uncompleted],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB"
                            ],
                            hoverBackgroundColor: [
                                "#FF0384",
                                "#3642EB"
                            ]
                }]
                      }
                  });

                  $("#percent").html("<strong>" + result.data.graphData.percent + "%</strong> of " + result.data.graphData.allowance + " Earned <br> You Can Have <strong>" + result.data.graphData.completed + "</strong> Dollars!");

                  
                  activityArr.forEach(function (act) {
                      
                          var elem = "<div class='activity'  data-name='" + act.name + "' data-timesCompleted='" + act.timesCompleted + "'>" +
                              "<div class='activityHeader'>" +
                                    "<strong id='" + act.name + "'>" + act.name + "</strong>" +
                              "</div>" +
                                "<div class'btn-group' role='group' aria-label='...'>"+
                                    "<button type='button' class='btn btn-default plusButton'><span class='glyphicon glyphicon-plus'></span></button>" +
                                    "<button type='button' class='btn btn-default minusButton'><span class='glyphicon glyphicon-minus'></span></button>" +
                                    "<button type='button' class='btn btn-default removeButton'><span class='glyphicon glyphicon-remove'></span></button>"+ 
                                "</div>" +
                              "<p>Value: " + act.value + " - Times Completed: " + act.timesCompleted + " - Max Times To Use: " + act.maxTimes + "</p>"+
                            "</div>";

                          $("#activitiesWrapper").append(elem);

                  }, this);
              }
          });


//==========================Chart Recreation=========================
