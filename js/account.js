var api = ""; // your xampp path to action.php example: "http://192.168.64.4/api/v1/action"

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    endDate: "today",
    startView: 2
});

const signout = document.getElementById('signout-btn');
signout.onclick = logout;

function logout() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/logout",
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            //var response = JSON.parse(xhr.responseText);
            window.setTimeout(function() {
                window.location = "index.html";
            }, 1000);
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}