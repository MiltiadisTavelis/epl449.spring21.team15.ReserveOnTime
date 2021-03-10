function submit() {
    var error = document.getElementById('pass');
    var email = document.getElementById('email-input');
    var pass = document.getElementById('password-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/login",
        "email": email.value,
        "password": pass.value
    };

    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            popUpMessage(response["status"], "success");

            //window.setTimeout(function() {
            //    window.location = "index.html";
            //, 1000);
        } else if (xhr.status === 403) {
            popUpMessage(response["status"], "danger");
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }
    xhr.open('POST', 'http://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}