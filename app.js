const CLIENT_ID = '36866534114-quffe9ok3s05kab59mfuvt0s4a7eqqer.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBIYrumhRpzcwz8E8FToH-dMoGfYFYQz90';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

async function intializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listMajors();
    } else {
        console.log('Please log in to the application.');
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

async function listMajors() {
    let response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1tzyxVXDZyk7FQtYm8nFYskisu5gdAf2QoV3SoDCzIRY',
        range: 'sheeq!A2:E',
    });
    const range = response.result;
    if (range.values.length > 0) {
        for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            console.log(`Name: ${row[0]}, Major: ${row[4]}`);
        }
    } else {
        console.log('No data found.');
    }
}
