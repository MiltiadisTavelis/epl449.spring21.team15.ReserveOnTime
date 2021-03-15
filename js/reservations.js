loadReservations()

function loadReservations() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "reservations/all",
        "sort": "oldest"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (!response.hasOwnProperty('Reservations')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "There are no available reservations.";
                shopDisplay.appendChild(displayMessage);
                return;
            }
            var shops = response["Reservations"];

            for (entry in reservations) {
                var reservation = reservations[entry]

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