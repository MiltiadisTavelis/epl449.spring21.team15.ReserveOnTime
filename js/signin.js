
function submit() {
    var email = document.getElementById('email-input');
    var pass = document.getElementById('password-input');
    var remember = document.getElementById('remember-me');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/login",
        "email": email.value,
        "password": pass.value
    };
    //console.log(remember.value);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response["status"] === 0) {
                popUpMessage(response["message"], "danger");
            } else if (response["status"] === 1) {
                if (remember.value === "on") {
                    
                    create_cookies();
                }
                popUpMessage(response["message"], "success");
               /* window.setTimeout(function() {
                    window.location = "index.html";
                }, 1000);*/
            } else if(response["status"] === 3){
                popUpMessage(response["message"], "danger");
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

function create_cookies() {

    var email = document.getElementById('email-input');
    var pass = document.getElementById('password-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/cookie",
        "email": email.value,
        "password": pass.value
    };
console.log(data);
    xhr.onload = function() {
        }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

}