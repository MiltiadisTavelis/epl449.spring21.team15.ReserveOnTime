checkSession("u", true)


const today = new Date();
today.setHours(0, 0, 0, 0);

$('.datefield').each(function(i, obj) {
    const picker = new Litepicker({ 
    element: this, 
    format: "DD MMM YYYY",
    singleMode: true,
    minDate: "01/01/1940",
    dropdowns: {
        minYear: new Date().getFullYear() - 150,
        maxYear: new Date().getFullYear(),
        months: true,
        years: true
  }

  });
});

const monthNamesLower = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function convertDate(sqlDate) {
    var res = sqlDate.split("/");
    var day_event = res[0];
    var month_event = monthNamesLower[res[1]-1];
    var year_event = res[2];
    if (day_event<10) {
        day_event = day_event.substring(1);
    }
    if (day_event === "1") {
        day_event = day_event + "st";
    }
    else if(day_event === "2"){
        day_event = day_event + "nd";
    }
    else if(day_event === "3"){
        day_event = day_event + "rd";
    }
    else {
        day_event = day_event + "th";
    }

    return day_event + " " + month_event + " " + year_event;
}

$('#loading').hide().fadeIn();
var loadercount = {
  value: 0,
  set plus(value) {
    this.value += value;
    if(this.value == 1){
        $('#loading').fadeOut( "slow" );
        $('#contents').removeAttr('hidden');
    }
  }
}

loadDet();

$( "#save" ).click(function() {
    var name = document.getElementById('firstname-input');
    if(name.value.length === 0 ){
        popUpMessage("Missing name information.", "danger");
        return;
    }
    var surname = document.getElementById('lastname-input');
    if(surname.value.length === 0 ){
        popUpMessage("Missing surname information.", "danger");
        return;
    }
    var gender = document.getElementById('gender-input');
    var birthday = document.getElementById('date-input');
    if(birthday.value.length === 0 ){
        popUpMessage("Missing birthday information.", "danger");
        return;
    }
    var code = document.getElementById('telcode-input');
    if(code.value.length === 0 ){
        popUpMessage("Missing code information.", "danger");
        return;
    }
    var number = document.getElementById('tel-input');
    if(number.value.length === 0 ){
        popUpMessage("Missing number information.", "danger");
        return;
    }
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/update",
        "fname": name.value,
        "lname": surname.value,
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
            } else {
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
    ;});

function loadDet() {
    var name = document.getElementById('firstname-input');
    var surname = document.getElementById('lastname-input');
    var gender = document.getElementById('gender-input');
    var code = document.getElementById('telcode-input');
    var number = document.getElementById('tel-input');
    var email = document.getElementById('email-input');
    var birthday = document.getElementById('date-input');

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
            } else {
                console.log(response);
                name.value = response.fname;
                surname.value = response.lname;
                gender.value = response.gender;
                birthday.value = convertDate(response.birth);
                //$("#date-input").datepicker('setDate', response.birth);
                code.value = response.phone_code;
                number.value = response.pnum;
                email.value = response.email;
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
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

var download = document.getElementById('download-data');

download.addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/data"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response['status'], "danger");
                return;
            }
            var link = document.createElement("a");
            link.download = "data.zip";
            link.href = response['message'];
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}, false);