
$(function(){
    
    let datePicker = document.getElementById('date-input');
    let picker = new Lightpick({
        field: datePicker,
        onSelect: function(date){
            datePicker.value = date.format('Do MMMM YYYY');
        }
    });
});

function submit() {
    var name = document.getElementById('firstname-input');
    var surname = document.getElementById('lastname-input');
    var gender = document.getElementById('gender-input');
    var birthday = document.getElementById('date-input');
    var code = document.getElementById('telcode-input');
    var number = document.getElementById('tel-input');
    var email = document.getElementById('email-input');
    var password = document.getElementById('password-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/cuser",
        "fname": name.value,
        "lname": surname.value,
        "birth": birthday.value,
        "gender": gender.value,
        "phone_code": code.value,
        "pnum": number.value,
        "email": email.value,
        "password": password.value
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty("status")) {
                popUpMessage(response["status"], "success");
                window.setTimeout(function() {
                    window.location = "signin.html";
                }, 2000);
            } else {
                popUpMessage("Unexpected error", "danger");
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