var CLIENT_ID = '36866534114-quffe9ok3s05kab59mfuvt0s4a7eqqer.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBIYrumhRpzcwz8E8FToH-dMoGfYFYQz90';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var content = document.getElementById('content');

function handleClientLoad() {
    gapi.load('client:auth2', initClient); // Tải và khởi tạo thư viện
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        console.error("Error loading GAPI client for API", error);
    });
}


function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        appendPre("Please log in to the application.");
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1tzyxVXDZyk7FQtYm8nFYskisu5gdAf2QoV3SoDCzIRY',
        range: 'PNK!A1:D5',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            appendPre('Name, Major:');
            for (var i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                appendPre(row[0] + ', ' + row[4]);
            }
        } else {
            appendPre('No data found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function updateSheet() {
    var values = [
        ["Updated Name", "Updated Major"]
    ];
    var body = {
        values: values
    };
    gapi.client.sheets.spreadsheets.values.update({
         spreadsheetId: '1tzyxVXDZyk7FQtYm8nFYskisu5gdAf2QoV3SoDCzIRY',
         range: 'PNK!A2',
         valueInputOption: 'RAW',
         resource: body
    }).then(function(response) {
        var result = response.result;
        appendPre(`${result.updatedCells} cells updated.`);
    });
}

function appendPre(message) {
    content.innerHTML += message + '\n';
}
