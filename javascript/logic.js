// Initialize Firebase
var config = {
    apiKey: "AIzaSyDR4pHWuhlmzQSqzPO6Y1dHWcbeO2zYz3c",
    authDomain: "train-scheduler-f3a87.firebaseapp.com",
    databaseURL: "https://train-scheduler-f3a87.firebaseio.com",
    projectId: "train-scheduler-f3a87",
    storageBucket: "",
    messagingSenderId: "1038337857973"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
// Initial Variables (SET the first set IN FIREBASE FIRST)
var name = "";
var destination = "";
var firstTime = 0;
var frequency = 0;

// Capture Button Click
$("#add-train").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    // Code in the logic for storing and retrieving the most recent user.
    name = $('#name-input').val().trim();
    destination = $('#destination-input').val().trim();
    //startDate = moment($('#date-input').val().trim(), "DD/MM/YYYY").format("MM/DD/YY");
    frequency = $('#frequency-input').val().trim();
    firstTime = $("#time-input").val().trim();
    //-------------------------------------------------------------------//
    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
    });
});

// function funct (){
//     var today = moment();
//     console.log(today);
//     var tomorrow = today.clone();
//     tomorrow =tomorrow.add(8, 'hours');
//     console.log(tomorrow);
//     console.log(today);
// }

// Firebase watcher + initial loader
//database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(childSnapshot) {
database.ref().on("child_added", function(childSnapshot) {

    var child = childSnapshot.val();
    // Print the initial data to the console.
    console.log(childSnapshot.val());
    console.log(child.name);
    console.log(child.destination);
    console.log(child.firstTime);
    console.log(child.frequency);
    //console.log(child.minutesAway);
    //console.log(child.nextArrival);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("THE FIRST TIME CONVERTED IS: " + firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("The current time is: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("THE DIFFERENCE IN TIME IS: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("Last train was " + tRemainder + " minutes ago.");
    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    console.log("There are " + minutesAway + " until the next train.");
    // Next Train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
    console.log("The next train arrives at: " + moment(nextArrival).format("hh:mm"));
    // Prettify the employee start
    // var startDatePretty = moment.unix(startDate).format("MM/DD/YY");

    // Change the html to reflect the initial value.
    $("#train-table > tbody").append("<tr><td>" + child.name + "</td><td>" + child.destination + "</td><td>" +
    child.frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td><td>");

}, function(errorObject) {
// If any errors are experienced, log them to console.
console.log("The read failed: " + errorObject.code);
});

// Display the current time for the page
function update() {
    $('#time').html(moment().format('H:mm:ss'));
}
setInterval(update, 1000);