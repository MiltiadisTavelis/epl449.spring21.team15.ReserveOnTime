const signout = document.getElementById('signout-btn');
signout.onclick = logout;

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