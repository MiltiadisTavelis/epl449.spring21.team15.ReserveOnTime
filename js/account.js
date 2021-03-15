$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    endDate: "today",
    startView: 2
});

loadDet();

function submit() {
	var name = document.getElementById('firstname-input');
    var surname = document.getElementById('lastname-input');
    var gender = document.getElementById('gender-input');
    var birthday = document.getElementById('date-input');
    var code = document.getElementById('telcode-input');
    var number = document.getElementById('tel-input');
    var email = document.getElementById('email-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/update",
        "fname": name.value,
        "lname": surname.value,
        "email": email.value,
        "pnum": number.value,
        "phone_code": code.value,
        "birth": birthday.value,
        "gender": gender.value,
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "success");
            }else{
	            popUpMessage("There was an unexpected error", "danger");
        	}
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('PUT', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadDet() {
    var name = document.getElementById('firstname-input');
    var surname = document.getElementById('lastname-input');
    var gender = document.getElementById('gender-input');
    var code = document.getElementById('telcode-input');
    var number = document.getElementById('tel-input');
    var email = document.getElementById('email-input');

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/user", 
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
                window.setTimeout(function() {
                	window.location = "signin.html";
                }, 1000);
            }else{
	            name.value = response.fname;
	            surname.value = response.lname;
	            gender.value = response.gender;
	            $("#date-input").datepicker('setDate',response.birth);
	            code.value = response.phone_code;
	            number.value = response.pnum;
	            email.value = response.email;
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

var reset = document.getElementById('res-pass');

reset.addEventListener('click', function() {
    var email = document.getElementById('email-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/passreset",
        "email": email.value
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response['status'], "danger");
                return;
            }
            popUpMessage(response['message'], "success");
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}, false);