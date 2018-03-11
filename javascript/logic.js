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

// Variable to reference the database.
var database = firebase.database();
// Make a directory to store information in the database.
var trainData = database.ref("/newTrainData");
//-------------------------------------------------------------------//

// Initial Variables (SET the first set IN FIREBASE FIRST)
var name = "";
var destination = "";
var firstTime = 0;
var frequency = 0;

// What all happens when the #add-train button is clicked.
$("#add-train").on("click", function(event) {
    // Keeps page from refreshing.
    event.preventDefault();

    // Data collected when #add-train is clicked.
    var trainName = $('#name-input').val().trim();
    var trainDestination = $('#destination-input').val().trim();
    var trainFrequency = $('#frequency-input').val().trim();
    var trainFirstTime = $("#time-input").val().trim();

    // Local object to hold new train data.
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        frequency: trainFrequency,
        firstTime: trainFirstTime
    }

    // Saves new train data to Firebase.
    database.ref("/newTrainData").push(newTrain);

    // Test to see if newTrain data was collected.
    console.log(newTrain);
});
//-------------------------------------------------------------------//

// Firebase event to add train to Firebase database and a new row with its data in the html upon each submission.
database.ref("/newTrainData").on("child_added", function(childSnapshot) {

    // Test to check for correct data from Firebase.
    console.log(childSnapshot.val());

    // Shorten variable targets.
    var child = childSnapshot.val();
    // Store data in variables.
    var trainName = child.name;
    var trainDestination = child.destination;
    var trainFirstTime = child.firstTime;
    var trainFrequency = child.frequency;

    // Test to check for correct variable data.
    console.log(child.name);
    console.log(child.destination);
    console.log(child.firstTime);
    console.log(child.frequency);

    // First train time (pushed back 1 year to make sure it comes before current time.)
    var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");
    console.log("THE FIRST TIME CONVERTED IS: " + firstTimeConverted);

    // Current Time.
    var currentTime = moment();
    console.log("The current time is: " + moment(currentTime).format("hh:mm"));

    // Difference between the times.
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("THE DIFFERENCE IN TIME IS: " + diffTime);

    // Time apart (remainder after the last increment of time.)
    var tRemainder = diffTime % trainFrequency;
    console.log("Last train was " + tRemainder + " minutes ago.");

    // Time until the next increment of time comes (frequency.)
    var minutesAway = trainFrequency - tRemainder;
    console.log("There are " + minutesAway + " minutes until the next train.");

    // Exact time of the next increment of time (train arrival.)
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
    console.log("The next train arrives at: " + nextArrival);

    // Add each train's data into the table.
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
    trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td><td>");

}, function(errorObject) {
// If any errors are experienced, log them to console.
console.log("The read failed: " + errorObject.code);
});

// Display the current time for the page
function update() {
    $("#time").html(moment().format('H:mm:ss'));
}
setInterval(update, 1000);



// Test function to demonstrate how to avoid Moment mutability.
// function funct (){
//     var today = moment();
//     console.log(today);
//     var tomorrow = today.clone();
//     tomorrow =tomorrow.add(8, 'hours');
//     console.log(tomorrow);
//     console.log(today);
// }