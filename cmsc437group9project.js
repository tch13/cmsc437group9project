/* Top comment section dedicated to important notes regarding the code below

Functions: login(), logout(), addUser(), removeUser(), addPatient(), removePatient(), addPatientVitals(),
           addPatientRecords(), addPatientXrays(), retrievePatientVitals(), retrievePatientRecords(),
           retrievePatientXrays(), removePatientRecords(), removePatientVitals(), removePatientXrays(),
           changeVentilatorSettings(), changeInfusionPumpSettings(), clearEntireDB()

Access notes: "S": Users identified with the "S" (super) userLevel will be able to access the login(), logout(),
              addUser(), removeUser(), and clearEntireDB() functions

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
              "warningMessage": A variable to which error messages should be printed
              "firstName": A User's first name
              "lastName": A user's last name
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

// For Evan to implement
function login(){
    // Create a super user if there is not already one (can only clear DB and add/remove user accounts)
    if (userDB[superUser] == null){
        userDB[superUser] =  {PASSWORD:"password", FIRSTNAME:"", LASTNAME:"", USERLEVEL:"S"}
    }
    // Get all necessary elements to create a user account from the document
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    if (userDB[userName] != null && userDB[userName].PASSWORD == password){
        currentUser = userName;
    }
    else{
        document.getElementById("warningMessage").innerHTML = userName + 
        " does not exist or the username or password was misspelled";
        return;
    }
}

// Should perform the rest of its functionality through HTML
// by taking the user back to the login screen
function logout(){
    currentUser = "";
}

function addUser(){
    // If the user is not a super user, give a warning and don't remove user
    if (userDB[currentUser].USERLEVEL != "S"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all necessary elements to create a user account from the document
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var userLevel = document.getElementById("userLevel").value;
    // Add all information to the userDB stored under the new user's userName
    userDB[userName] = {PASSWORD:password, FIRSTNAME:firstName, LASTNAME:lastName, USERLEVEL:userLevel};
    // Convert database to a JSON and store in localStorage
    var JSONDB = JSON.stringify(userDB);
    localStorage.setItem("localUserDB", JSONDB);
}

function removeUser(){
    // If the user is not a super user, give a warning and don't remove user
    if (userDB[currentUser].USERLEVEL != "S"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all necessary elements to remove a user account from the document
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var JSONDB = localStorage.getItem("localUserDB");
    var JSDB = JSON.parse(JSONDB);
    if(JSDB[userName] != null && JSDB[userName].PASSWORD == password){
        delete JSDB[userName];
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localUserDB", JSONDB);
    }
    else{
        document.getElementById("warningMessage").innerHTML = userName + 
        " does not exist or password was incorrect";
    }
}

function addPatient(){
    // If the user is not a physician or a nurse, give a warning and don't add patient
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all necessary elements to create a patient account from the document
    // NOTE: patientName should be of the form FirstNameLastNameBirthDate
    // Example patientName: JohnSmith01234567
    var patientName = document.getElementById("patientName").value;
    // Add all information to the patientDB stored under the new patient's userName
    patientDB[patientName] = {VITALS:{}, RECORDS:{}, XRAYS:{}};
    // Convert database to a JSON and store in localStorage
    var JSONDB = JSON.stringify(patientDB);
    localStorage.setItem("localPatientDB", JSONDB);
}

function removePatient(){
    // If the user is not a physician or a nurse, give a warning and don't remove patient
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all necessary elements to remove a patient account from the document
    var patientName = document.getElementById("patientName").value;
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    if(JSDB[patientName] != null){
        delete JSDB[userName];
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

// For Tommy to implement
function addPatientVitals(){
    // If the user is not a physician or a nurse, give a warning and don't add patient vitals
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all required elements including ECG, SpO2, CO2, Blood pressure, and Pulse
    var patientName = document.getElementById("patientName").value;
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
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

function addPatientRecords(){
    // If the user is not a physician, give a warning and don't add patient record
    if (userDB[currentUser].USERLEVEL != "P"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all required elements
    var patientName = document.getElementById("patientName").value;
    var records = document.getElementById("addRecords").value;
    if (patientDB[patientName] != null){
        // Add records to the patientDB stored under the new patient's userName
        patientDB[patientName].RECORDS = {records};
        // Convert database to a JSON and store in localStorage
        var JSONDB = JSON.stringify(patientDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

function addPatientXrays(){
    // If the user is not a physician, give a warning and don't add patient x-ray
    if (userDB[currentUser].USERLEVEL != "P"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all required elements
    var patientName = document.getElementById("patientName").value;
    var xrays = document.getElementById("addXrays").value;
    if (patientDB[patientName] != null){
        // Add all x-ray information to the patientDB stored under the new patient's userName
        patientDB[patientName].XRAYS = {xrays};
        // Convert database to a JSON and store in localStorage
        var JSONDB = JSON.stringify(patientDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

function retrievePatientVitals(){
    // If the user is not a physician or a nurse, give a warning and don't retrieve patient vitals
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    var patientName = document.getElementById("patientName").value;
    if (JSDB[patientName] != null){
        // Retrieve all vital information from the patientDB stored under the patient's patientName
        document.getElementById("retrieveVitals").value = JSDB[patientName].VITALS;
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

function retrievePatientRecords(){
    // If the user is not a physician or a nurse, give a warning and don't retrieve patient records
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    var patientName = document.getElementById("patientName").value;
    if (JSDB[patientName] != null){
        // Retrieve all medical records from the patientDB stored under the patient's patientName
        document.getElementById("retrieveRecords").value = JSDB[patientName].RECORDS;
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

function retrievePatientXrays(){
    // If the user is not a physician, give a warning and don't retrieve patient x-rays
    if (userDB[currentUser].USERLEVEL != "P"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    var patientName = document.getElementById("patientName").value;
    if (JSDB[patientName] != null){
        // Retrieve all x-ray information from the patientDB stored under the patient's patientName
        document.getElementById("retrieveXrays").value = JSDB[patientName].XRAYS;
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

// For Tommy to implement
function removePatientVitals(){
    // If the user is not a physician or a nurse, give a warning and don't remove patient vitals
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all necessary elements to remove patient vitals from the document
    var patientName = document.getElementById("patientName").value;
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Remove vitals information from patient's database entry
    if(JSDB[patientName] != null && JSDB[patientName].VITALS != null){
        //delete JSDB[userName].VITALS;
        JSDB[userName].VITALS = {};
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

function removePatientRecords(){
    // If the user is not a physician, give a warning and don't remove patient records
    if (userDB[currentUser].USERLEVEL != "P"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all necessary elements to remove patient records from the document
    var patientName = document.getElementById("patientName").value;
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Remove records from patient's database entry
    if(JSDB[patientName] != null && JSDB[patientName].RECORDS != null){
        //delete JSDB[userName].RECORDS;
        JSDB[userName].RECORDS = {};
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

function removePatientXrays(){
    // If the user is not a physician, give a warning and don't remove patient x-rays
    if (userDB[currentUser].USERLEVEL != "P"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    // Get all necessary elements to remove patient x-rays from the document
    var patientName = document.getElementById("patientName").value;
    var JSONDB = localStorage.getItem("localPatientDB");
    var JSDB = JSON.parse(JSONDB);
    // Remove x-ray information from patient's database entry
    if(JSDB[patientName] != null && JSDB[patientName].RECORDS != null){
        //delete JSDB[userName].XRAYS;
        JSDB[userName].XRAYS = {};
        JSONDB = JSON.stringify(JSDB);
        localStorage.setItem("localPatientDB", JSONDB);
    }
    else{
        document.getElementById("warningMessage").innerHTML = patientName + 
        " does not exist or was spelled incorrectly";
    }
}

// For Evan to implement
function changeVentilatorSettings(){
    // If the user is not a physician or a nurse, give a warning and don't change settings
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
}

// For Evan to implement
function changeInfusionPumpSettings(){
    // If the user is not a physician or a nurse, give a warning and don't change settings
    if (userDB[currentUser].USERLEVEL != "P" && userDB[currentUser].USERLEVEL != "N"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
}

function clearEntireDB(){
    // If the user is not a super user, give a warning and don't clear DB
    if (userDB[currentUser].USERLEVEL != "S"){
        document.getElementById("warningMessage").innerHTML = currentUser + 
        " is not of a valid authorization level for this action";
        return;
    }
    localStorage.clear();
    patientDB = {};
    userDB = {};
}