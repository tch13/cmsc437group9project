/* Top comment section dedicated to important notes regarding the code below

Functions: login(), logout(), addUser(), removeUser(), addPatient(), removePatient(), addPatientVitals(),
           addPatientRecords(), addPatientXrays(), retrievePatientVitals(), retrievePatientRecords(),
           retrievePatientXrays(), removePatientRecords(), removePatientVitals(), removePatientXrays(),
           changeVentilatorSettings(), changeInfusionPumpSettings(), clearEntireDB(), checkXrayAuthorization()

Access notes: "S": Users identified with the "S" (super) userLevel will be able to access all functions

              "P": Users identified with the "P" (physician) userLevel can access login(), logout(), addPatient(),
              removePatient(), addPatientVitals(), addPatientRecords(), addPatientXrays(), retrievePatientVitals(),
              retrievePatientRecords(), retrievePatientXrays(), removePatientRecords(), removePatientVitals(),
              removePatientXrays(), changeVentilatorSettings(), and changeInfusionPumpSettings() functions

              "N": Users identified with the "N" (nurse) userLevel can access login(), logout(), addPatient(),
              removePatient(), addPatientVitals(), retrievePatientVitals(), retrievePatientRecords(),
              removePatientVitals(), changeVentilatorSettings(), and changeInfusionPumpSettings() functions

*/
// Database of patients
var patientDB = {};
// Database of users
var userDB = {};
// Current user (doctor)
var currentUser = "";
var superUser = "admin";
// loggedIn Boolean variable
var loggedIn = false;

// For Evan to implement
function login(){
    // Set databases if required
    if (localStorage.getItem("localUserDB") == null){
        userDB[superUser] =  {PASSWORD:"password", USERLEVEL:"S"};
        localStorage.setItem("localUserDB", JSON.stringify(userDB));
    }
    if (localStorage.getItem("localPatientDB") == null){
        localStorage.setItem("localPatientDB", JSON.stringify(patientDB));
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements to create a user account from the document
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var JSONDB = localStorage.getItem("localUserDB");
    var JSDB = JSON.parse(JSONDB);
    
    // authenticate the login
    if (JSDB[userName] != null && JSDB[userName].PASSWORD == password){
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", userName);
        localStorage.setItem("currentUserLevel", userDB[userName].USERLEVEL);
        // Reset the login boxes
        document.getElementById("userName").value = "";
        document.getElementById("password").value = "";
        alert("Successfully logged in as \"" + String(userName)) + "\"";
    }
    else{
        alert("The user \"" + String(userName) +
        "\" does not exist or the username or password was misspelled\n" +
        "Note: If you need to create a new account, please login with the super" +
        "user; username:admin, password:password");
        return;
    }
}

// Should perform the rest of its functionality through HTML
// by taking the user back to the login screen
function logout(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    localStorage.setItem("currentUser",  "");
    localStorage.setItem("currentUserLevel", "");
    localStorage.setItem("loggedIn", "false");
    alert("Logout Successful");
}

function addUser(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a super user, give a warning and don't remove user
    if ( localStorage.getItem("currentUserLevel") != "S"){
        alert("The current user is not of a valid S-tier authorization level for this action; " +
        "Please login using the super user first (username:admin, password:password)");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements to create a user account from the document
    var userName = document.getElementById("addOrRemoveUserName").value;
    var password = document.getElementById("addOrRemovePassword").value;
    var userLevel = document.getElementById("addOrRemoveUserLevel").value;
    var ul = String(userLevel);
    // Check input to make sure the userLevel is correct
    if (ul != "P" && ul != "N"){
        alert("The provided user level was invalid (can only be \"P\" or \"N\")");
        return;
    }
    // Add all information to the userDB stored under the new user's userName
    userDB[userName] = {PASSWORD:password, USERLEVEL:userLevel};
    // Convert database to a JSON and store in localStorage
    var JSONDB = JSON.stringify(userDB);
    localStorage.setItem("localUserDB", JSONDB);
    document.getElementById("addOrRemoveUserName").value = "";
    document.getElementById("addOrRemovePassword").value = "";
    document.getElementById("addOrRemoveUserLevel").value = "";
}

function removeUser(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a super user, give a warning and don't remove user
    if (localStorage.getItem("currentUserLevel") != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid S-tier authorization level for this action; " +
        "Please login using the super user first (username:admin, password:password)");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements to remove a user account from the document
    var userName = document.getElementById("addOrRemoveUserName").value;
    var password = document.getElementById("addOrRemovePassword").value;
    var JSONDB = localStorage.getItem("localUserDB");
    var JSDB = JSON.parse(JSONDB);
    if(JSDB[userName] != null && JSDB[userName].PASSWORD == password){
        delete JSDB[userName];
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localUserDB", JSONDB);
        document.getElementById("addOrRemoveUserName").value = "";
        document.getElementById("addOrRemovePassword").value = "";
        document.getElementById("addOrRemoveUserLevel").value = "";
    }
    else{
        alert("The current user \"" + currentUser +
        "\" does not exist or the username or password was misspelled")
    }
}

function addPatient(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    var ul = localStorage.getItem("currentUserLevel");
    // If the user is not a physician or a nurse, give a warning and don't add patient
    if (ul != "P" && ul != "N" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements to create a patient account from the document
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("patientFN").value;
    var patientDOB = document.getElementById("patientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    // Add all information to the patientDB stored under the new patient's userName
    patientDB[patientName] = {VITALS:{}, RECORDS:{}, XRAYS:{}};
    // Convert database to a JSON and store in localStorage
    var JSONDB = JSON.stringify(patientDB);
    localStorage.setItem("localPatientDB", JSONDB);
    document.getElementById("patientFN").value = "";
    document.getElementById("patientDOB").value = "";
}

function removePatient(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
              
    var ul = localStorage.getItem("currentUserLevel");
    // If the user is not a physician or a nurse, give a warning and don't add patient
    if (ul != "P" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("patientFN").value;
    var patientDOB = document.getElementById("patientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if(JSDB[patientName] != null){
        delete JSDB[patientName];
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
        document.getElementById("patientFN").value = "";
        document.getElementById("patientDOB").value = "";
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstNameLastNameBirthDate, " +
        "for example; JohnSmith09241995");
    }
}

// For Tommy to implement
function addPatientVitals(){
    // If user is not logged in, give error and return
    if (localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician or a nurse, give a warning and don't add patient vitals
    var ul = localStorage.getItem("currentUserLevel");

    if (ul != "P" && ul != "N" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("vitalsPatientFN").value;
    var patientDOB = document.getElementById("vitalsPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    var vitalsDate = document.getElementById("vitalsDate").value;
    var ECG = document.getElementById("ECG").value;
    var SpO2 = document.getElementById("SpO2").value;
    var CO2 = document.getElementById("CO2").value;
    var BP = document.getElementById("BP").value;
    var P = document.getElementById("P").value;
    if (patientDB[patientName] != null){
        // Add all vitals information to the patientDB stored under the new patient's userName
        patientDB[patientName].VITALS[vitalsDate] = {ECG, SpO2, CO2, BP, P};
        // Convert database to a JSON and store in localStorage
        var JSONDB = JSON.stringify(patientDB);
        localStorage.setItem("localPatientDB", JSONDB);
        document.getElementById("ECG").value = "";
        document.getElementById("SpO2").value = "";
        document.getElementById("CO2").value = "";
        document.getElementById("BP").value = "";
        document.getElementById("P").value = "";
        document.getElementById("vitalsDate").value = "";
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function addPatientRecords(){
    // If user is not logged in, give error and return
    if( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and don't add patient record
    var ul = localStorage.getItem("currentUserLevel");

    if (ul != "P" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("recordsPatientFN").value;
    var patientDOB = document.getElementById("recordsPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    var recordName = document.getElementById("recordName").value;
    var recordDate = document.getElementById("recordDate").value;
    var recordToAdd = document.getElementById("recordToAdd").value;
    if (patientDB[patientName] != null){
        // Add records to the patientDB stored under the new patient's userName
        patientDB[patientName].RECORDS[recordName] = {RECORD:recordToAdd, DATE:recordDate};
        // Convert database to a JSON and store in localStorage
        var JSONDB = JSON.stringify(patientDB);
        localStorage.setItem("localPatientDB", JSONDB);
        document.getElementById("recordName").value = "";
        document.getElementById("recordDate").value = "";
        document.getElementById("recordToAdd").value = "";
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function addPatientXrays(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and return
    var ul = localStorage.getItem("currentUserLevel");
    if (ul != "P" && ul != "S"){
        alert("The current user is not of a valid P-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("xraysPatientFN").value;
    var patientDOB = document.getElementById("xraysPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    var xrayDate = document.getElementById("xrayDate").value;
    var xrayInfo = document.getElementById("xrayInfo").value;
    if (patientDB[patientName] != null){
        // Add all x-ray information to the patientDB stored under the new patient's userName
        patientDB[patientName].XRAYS[xrayDate] = {INFO:xrayInfo};
        // Convert database to a JSON and store in localStorage
        var JSONDB = JSON.stringify(patientDB);
        localStorage.setItem("localPatientDB", JSONDB);
        document.getElementById("xrayDate").value = "";
        document.getElementById("xrayInfo").value = "";
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function retrievePatientVitals(){
    // If user is not logged in, give error and return
    if (localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician or a nurse, give a warning and don't retrieve patient vitals
    var ul = localStorage.getItem("currentUserLevel");

    if (ul != "P" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));

    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("vitalsPatientFN").value;
    var patientDOB = document.getElementById("vitalsPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    else if (JSDB[patientName] != null){
        // Retrieve all vital information from the patientDB stored under the patient's patientName
        document.getElementById("retrieveVitals").innerHTML = "";
        for (var key in JSDB[patientName].VITALS){
            if (JSDB[patientName].VITALS.hasOwnProperty(key)) {
                // [ECG, SpO2, CO2, BP, P]
                document.getElementById("retrieveVitals").innerHTML += "Vitals Date: " + String(key) + "<br>";
                document.getElementById("retrieveVitals").innerHTML += "Vitals Info: [ECG = " +
                String(JSDB[patientName].VITALS[key].ECG) + ", SpO2 = " + String(JSDB[patientName].VITALS[key].SpO2) +
                ", CO2 = " + String(JSDB[patientName].VITALS[key].CO2) + ", BP = " + String(JSDB[patientName].VITALS[key].BP) +
                ", P = " + String(JSDB[patientName].VITALS[key].P) + "]" + "<br><br><br>";
            }
        }
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function retrievePatientRecords(){
    // If user is not logged in, give error and return
    if (localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician or a nurse, give a warning and don't retrieve patient records
    var ul = localStorage.getItem("currentUserLevel");

    if (ul != "P" && ul != "N" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));

    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("recordsPatientFN").value;
    var patientDOB = document.getElementById("recordsPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    else if (JSDB[patientName] != null){
        // Retrieve all medical records from the patientDB stored under the patient's patientName
        //var myObject = JSON.stringify(JSDB[patientName].RECORDS);
        //var myObject = JSON.stringify(JSDB);
        document.getElementById("retrieveRecords").innerHTML = "";
        for (var key in JSDB[patientName].RECORDS){
            if (JSDB[patientName].RECORDS.hasOwnProperty(key)) {
                document.getElementById("retrieveRecords").innerHTML += "Record Name: " + String(key) + "<br>";
                document.getElementById("retrieveRecords").innerHTML += "Record Date: " + String(JSDB[patientName].RECORDS[key].DATE) + "<br>";
                document.getElementById("retrieveRecords").innerHTML += "Record Notes: " + String(JSDB[patientName].RECORDS[key].RECORD) + "<br><br><br>";
            }
        }
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function retrievePatientXrays(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and return
    var ul = localStorage.getItem("currentUserLevel");
    if (ul != "P" && ul != "S"){
        alert("The current user is not of a valid P-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));

    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("xraysPatientFN").value;
    var patientDOB = document.getElementById("xraysPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    else if (JSDB[patientName] != null){
        // Retrieve all x-ray information from the patientDB stored under the patient's patientName
        document.getElementById("retrieveXrays").innerHTML = "";
        for (var key in JSDB[patientName].XRAYS){
            if (JSDB[patientName].XRAYS.hasOwnProperty(key)) {
                document.getElementById("retrieveXrays").innerHTML += "X-ray Date: " + String(key) + "<br>";
                document.getElementById("retrieveXrays").innerHTML += "X-ray Information: " + String(JSDB[patientName].XRAYS[key].INFO) + "<br><br><br>";
            }
        }
        document.getElementById("xraysPatientName").value = "";
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

// For Tommy to implement
function removePatientVitals(){
    // If user is not logged in, give error and return
    if (localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician or a nurse, give a warning and don't remove patient vitals
    var ul = localStorage.getItem("currentUserLevel");

    if (ul != "P" && ul != "N" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("vitalsPatientFN").value;
    var patientDOB = document.getElementById("vitalsPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    // Remove vitals information from patient's database entry
    else if(JSDB[patientName] != null && JSDB[patientName].VITALS != null){
        //delete JSDB[userName].VITALS;
        JSDB[patientName].VITALS = {};
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function removePatientRecords(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and don't remove patient records
    var ul = localStorage.getItem("currentUserLevel");

    if (ul != "P" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("recordsPatientFN").value;
    var patientDOB = document.getElementById("recordsPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    // Remove records from patient's database entry
    else if(JSDB[patientName] != null && JSDB[patientName].RECORDS != null){
        //delete JSDB[userName].RECORDS;
        JSDB[patientName].RECORDS = {};
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function removePatientXrays(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and return
    var ul = localStorage.getItem("currentUserLevel");
    if (ul != "P" && ul != "S"){
        alert("The current user is not of a valid P-tier authorization level for this action");
        return;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("xraysPatientFN").value;
    var patientDOB = document.getElementById("xraysPatientDOB").value;
    var patientName = String(patientFN) + " " + String(patientDOB);
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    // Remove x-ray information from patient's database entry
    else if(JSDB[patientName] != null && JSDB[patientName].XRAYS != null){
        //delete JSDB[userName].XRAYS;
        JSDB[patientName].XRAYS = {};
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        alert("The patientName \"" + String(patientName) +
        "\" does not exist or was misspelled\n\n" +
        "Note: The patientName must be of the form FirstName LastName BirthDate, " +
        "for example; John Smith 09/24/1995");
    }
}

function checkXrayAuthorization(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and return
    var ul = localStorage.getItem("currentUserLevel");
    if (ul != "P" && ul != "S"){
        alert("The current user is not of a valid P-tier authorization level for this action");
        return;
    }
    if (localStorage.getItem("hrefLocation") == null){
        localStorage.setItem("hrefLocation", "1");
    }
    if (localStorage.getItem("hrefLocation") == "1") {
        document.location='xrays.html';
        localStorage.setItem("hrefLocation", "2");
    }
    else if (localStorage.getItem("hrefLocation") == "2"){
        document.location='xraysARD.html';
        localStorage.setItem("hrefLocation", "1");
    }
}

// For Evan to implement
function changeDeviceSettings(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return false;
    }
    // Update local databases as necessary
    userDB = JSON.parse(localStorage.getItem("localUserDB"));
    patientDB = JSON.parse(localStorage.getItem("localPatientDB"));
    // If the user is not a physician or a nurse, give a warning and don't change settings
    var ul = localStorage.getItem("currentUserLevel");
    if (ul != "P" && ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return false;
    }
    return true;
}

function clearEntireDB(){
    // If user is not logged in, give error and return
    if (localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a super user, give a warning and don't clear DB
    var ul = localStorage.getItem("currentUserLevel");
    if (ul != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    localStorage.clear();
    patientDB = {};
    userDB = {};
}
