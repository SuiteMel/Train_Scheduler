// Initialize Firebase
var config = {
  apiKey: "AIzaSyA2QWg34B7SHv_O206mIOuQkmTS0uyPNJo",
  authDomain: "suitemels-train-scheduler.firebaseapp.com",
  databaseURL: "https://suitemels-train-scheduler.firebaseio.com",
  projectId: "suitemels-train-scheduler",
  storageBucket: "suitemels-train-scheduler.appspot.com",
  messagingSenderId: "698210641196"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#trainName").val().trim();
  var trainDest = $("#trainDest").val().trim();
  var trainTime = moment($("#trainTime").val().trim(), "HH:mm").format("X");
  var trainFreq = moment($("#trainFreq").val().trim(), "mm").format("X");

  var minAway = 0;

  database.ref().push({ 
    name: trainName,
    dest: trainDest,
    time: trainTime,
    freq: trainFreq
  });

  $("#addTrain")[0].reset();
  $('form:first *:input[type!=hidden]:first').focus();
});

database.ref().on("child_added", function(childSnapshot) { 
  var timeShot = childSnapshot.val().time
  var freqShot = childSnapshot.val().freq;

  var timePretty = moment.unix(timeShot).format("hh:mm A");
  var freqPretty = moment.unix(freqShot).format("mm");

  var nextArr = moment(timeShot, "X").fromNow();

  var timeX = moment(timeShot, "X").format("X");
  var currentX = moment().format("X");

  //var minAwayPretty = moment.duration(minAway, 'minutes');

  var freqMoment = moment.duration(freqShot, 'minutes');

  var totalTime = moment(moment.unix(timeShot, "X"), "minutes").add(freqPretty, "minutes");

  var totalTimePretty = moment(totalTime).format("HH:mm A");

  //positive time, gives difference in a day, not the next day
  var minAway = moment(totalTime, "minutes").diff(moment(), "minutes");

  //var minAwayPretty = moment(minAway).format("mm"); 
  
  //Create dynamic rows
   var row = $("<tr>");
  
   var nameData = $("<td>").text(childSnapshot.val().name);
   var destData = $("<td>").text(childSnapshot.val().dest);
   var timeData = $("<td>").text(totalTimePretty);
   var freqData = $("<td>").text(freqPretty);
   var minutesData = $("<td>").text(minAway);

   
 
   row.append(nameData, destData, freqData, timeData, minutesData);
   $("#trainTable").append(row);
});


//start time + freq = next arrival
//diff next arrival to now