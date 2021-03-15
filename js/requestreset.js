function submit() {
    var email = document.getElementById('email-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/passreset",
        "email": email.value
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            window.setTimeout(function() {
                window.location = "index.html";
            }, 3000);
            popUpMessage(response['message'], "success");
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}