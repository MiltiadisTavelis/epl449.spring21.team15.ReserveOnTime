const signout = document.getElementById('signout-btn');
signout.onclick = logout;

displayNav()

function logout() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/logout",
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            window.location = "index.html";
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function displayNav() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/islogin"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response["status"] === "1") {
                document.getElementById('account-btn').classList.remove('d-none')
                document.getElementById('reservations-btn').classList.remove('d-none')
                document.getElementById('signout-btn').classList.remove('d-none')
            } else {
                document.getElementById('signin-btn').classList.remove('d-none')
                document.getElementById('signup-btn').classList.remove('d-none')
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