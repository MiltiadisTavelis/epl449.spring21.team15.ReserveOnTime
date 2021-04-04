const signout = document.getElementById('signout-btn');
signout.onclick = logout;

redirectEmptySession()

function logout() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/logout",
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            window.location = "signin.html";
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function redirectEmptySession() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/islogin"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response["status"] === "0") {
                window.location = "signin.html";
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}