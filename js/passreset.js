const link = window.location.search;
const urlParams = new URLSearchParams(link);
const email = urlParams.get('email');
const code = urlParams.get('hash');
var okay = 0;

load();

function load() {
    var changeemail = document.getElementById('email-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/verifyhash",
        "email": email,
        "hash": code
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                window.location = "index.html";
                return;
            }

            changeemail.value = email;
            okay = 1;
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

}

function submit() {
    if(okay === 0){
        popUpMessage("Invalid Link!", "danger");
        return;
    }
    var email = document.getElementById('email-input');
    var pass = document.getElementById('password-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/newpass",
        "email": email.value,
        "pass": pass.value,
        "hash": code
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                popUpMessage(response['status'], "danger");
                return;
            }

            window.setTimeout(function() {
                window.location = "signin.html";
            }, 3000);

            popUpMessage(response['message'], "success");
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('PUT', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}