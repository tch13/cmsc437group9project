/* Top comment section dedicated to important notes regarding the code below

Functions: login(), logout(), addUser(), removeUser(), addPatient(), removePatient(), addPatientVitals(),
           addPatientRecords(), addPatientXrays(), retrievePatientVitals(), retrievePatientRecords(),
           retrievePatientXrays(), removePatientRecords(), removePatientVitals(), removePatientXrays(),
           changeVentilatorSettings(), changeInfusionPumpSettings(), clearEntireDB()

Access notes: "S": Users identified with the "S" (super) userLevel will be able to access all functions

              "P": Users identified with the "P" (physician) userLevel can access login(), logout(), addPatient(),
              removePatient(), addPatientVitals(), addPatientRecords(), addPatientXrays(), retrievePatientVitals(),
              retrievePatientRecords(), retrievePatientXrays(), removePatientRecords(), removePatientVitals(),
              removePatientXrays(), changeVentilatorSettings(), and changeInfusionPumpSettings() functions

              "N": Users identified with the "N" (nurse) userLevel can access login(), logout(), addPatient(),
              removePatient(), addPatientVitals(), retrievePatientVitals(), retrievePatientRecords(),
              removePatientVitals(), changeVentilatorSettings(), and changeInfusionPumpSettings() functions

Key HTML IDs: "userName": User's username to uniquely identify their system account
              "patientName": Patient's name in the format FirstNameLastNameBirthDate
                    - Example: John Smith was born on August 10th, 2001. His patientName is JohnSmith08102001
              "password": The user's password to their account
              "userLevel": User's level of authority ("S", "P", "N")
              "ECG", "SpO2", "CO2", "BP", "P": Different variables for the different vital signs to be added
              "addRecords": Records to be added
              "addXrays": X-rays to be added
              "retrieveVitals": A variable to which the retrieved vital signs can be printed (may need to be
                    separated into the different vital categories)
              "retrieveRecords": A variable to which the retrieved records can be printed
              "retrieveXrays": A variable to which the retrieved X-rays can be printed (might need to be
                    implemented differently due to the visual aspect of X-rays themselves)

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
    // Create a super user if there is not already one (can only clear DB and add/remove user accounts)
    if (userDB[superUser] == null){
        userDB[superUser] =  {PASSWORD:"password", USERLEVEL:"S"}
    }
    // Get all necessary elements to create a user account from the document
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    if (userDB[userName] != null && userDB[userName].PASSWORD == password){
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", userName);
        localStorage.setItem("currentUserLevel", userDB[userName].USERLEVEL);
        // Reset the login boxes
        document.getElementById("userName").value = "";
        document.getElementById("password").value = "";
    }
    else{
        alert("The user \"" + String(userName) +
        "\" does not exist or the username or password was misspelled");
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
    localStorage.setItem("currentUser",  "");
    localStorage.setItem("loggedIn", "false");
}

function addUser(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a super user, give a warning and don't remove user
    if (userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid S-tier authorization level for this action; " +
        "Please login using the super user first (username:admin, password:password)");
        return;
    }
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
    if (userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid S-tier authorization level for this action; " +
        "Please login using the super user first (username:admin, password:password)");
        return;
    }
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
    // If the user is not a physician or a nurse, give a warning and don't add patient
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Get all necessary elements to create a patient account from the document
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("patientFN").value;
    var patientDOB = document.getElementById("patientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
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
           
           
     
    // If the user is not a physician or a nurse, give a warning and don't remove patient
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){ 
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    
 
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("patientFN").value;
    var patientDOB = document.getElementById("patientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if(JSDB[patientName] != null){
        delete JSDB[userName];
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
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("vitalsPatientFN").value;
    var patientDOB = document.getElementById("vitalsPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
    var ECG = document.getElementById("ECG").value;
    var SpO2 = document.getElementById("SpO2").value;
    var CO2 = document.getElementById("CO2").value;
    var BP = document.getElementById("BP").value;
    var P = document.getElementById("P").value;
    if (patientDB[patientName] != null){
        // Add all vitals information to the patientDB stored under the new patient's userName
        patientDB[patientName].VITALS = {ECG, SpO2, CO2, BP, P};
        // Convert database to a JSON and store in localStorage
        var JSONDB = JSON.stringify(patientDB);
        localStorage.setItem("localPatientDB", JSONDB);
        document.getElementById("ECG").value = "";
        document.getElementById("SpO2").value = "";
        document.getElementById("CO2").value = "";
        document.getElementById("BP").value = "";
        document.getElementById("P").value = "";
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
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("recordsPatientFN").value;
    var patientDOB = document.getElementById("recordsPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
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
    // If the user is not a physician, give a warning and don't add patient x-ray
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("xraysPatientFN").value;
    var patientDOB = document.getElementById("xraysPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
    var xrays = document.getElementById("addXrays").value;
    if (patientDB[patientName] != null){
        // Add all x-ray information to the patientDB stored under the new patient's userName
        patientDB[patientName].XRAYS = {xrays};
        // Convert database to a JSON and store in localStorage
        var JSONDB = JSON.stringify(patientDB);
        localStorage.setItem("localPatientDB", JSONDB);
        document.getElementById("addXrays").value = "";
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
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("vitalsPatientFN").value;
    var patientDOB = document.getElementById("vitalsPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    else if (JSDB[patientName] != null){
        // Retrieve all vital information from the patientDB stored under the patient's patientName
        document.getElementById("retrieveVitals").value = JSDB[patientName].VITALS;
        document.getElementById("vitalsPatientName").value = "";
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
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("recordsPatientFN").value;
    var patientDOB = document.getElementById("recordsPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
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
        //document.getElementById("retrieveRecords").innerHTML;
        document.getElementById("recordsPatientName").value = "";
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
    if (loggedIn == false) {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and don't retrieve patient x-rays
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("xraysPatientFN").value;
    var patientDOB = document.getElementById("xraysPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    else if (JSDB[patientName] != null){
        // Retrieve all x-ray information from the patientDB stored under the patient's patientName
        document.getElementById("retrieveXrays").value = JSDB[patientName].XRAYS;
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
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("vitalsPatientFN").value;
    var patientDOB = document.getElementById("vitalsPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    // Remove vitals information from patient's database entry
    else if(JSDB[patientName] != null && JSDB[patientName].VITALS != null){
        //delete JSDB[userName].VITALS;
        JSDB[userName].VITALS = {};
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
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("recordsPatientFN").value;
    var patientDOB = document.getElementById("recordsPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
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
    if (loggedIn == false) {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician, give a warning and don't remove patient x-rays
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P-tier authorization level for this action");
        return;
    }
    // Get all necessary elements
    // NOTE: patientName should be of the form FirstName LastName BirthDate
    var patientFN = document.getElementById("xraysPatientFN").value;
    var patientDOB = document.getElementById("xraysPatientDOB").value;
    var patientName = String(patientFN) + String(patientDOB);
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if (JSDB == null){
        alert("The patient database has nothing in it");
    }
    // Remove x-ray information from patient's database entry
    else if(JSDB[patientName] != null && JSDB[patientName].RECORDS != null){
        //delete JSDB[userName].XRAYS;
        JSDB[userName].XRAYS = {};
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

// For Evan to implement
function changeVentilatorSettings(){
    // If user is not logged in, give error and return
    if ( localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return false;
    }
    // If the user is not a physician or a nurse, give a warning and don't change settings
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return false;
    }
           
    return true;
}

// For Evan to implement
function changeInfusionPumpSettings(){
    // If user is not logged in, give error and return
    if (loggedIn == false) {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a physician or a nurse, give a warning and don't change settings
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N" &&
    userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid P or N-tier authorization level for this action");
        return;
    }
}

function clearEntireDB(){
    // If user is not logged in, give error and return
    if (localStorage.getItem("loggedIn") != "true") {
        alert("You are currently not logged in, please do so before performing any further actions");
        return;
    }
    // If the user is not a super user, give a warning and don't clear DB
    if (userDB[currentUser].USERLEVEL != "S"){
        alert("The current user \"" + currentUser +
        "\" is not of a valid S-tier authorization level for this action; " +
        "Please login using the super user first (username:admin, password:password)");
        return;
    }
    localStorage.clear();
    patientDB = {};
    userDB = {};
}
