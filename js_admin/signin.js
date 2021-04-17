removeDoubleSession()

function submit() {
    var email = document.getElementById('email-input');
    var pass = document.getElementById('password-input');
    //var remember = document.getElementById('remember-me');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/admin",
        "email": email.value,
        "password": pass.value
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if(response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            } else {
                popUpMessage(response["message"], "success");
                window.setTimeout(function() {
                    window.location = "index.html";
                }, 1000);
            }
            
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }


    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}