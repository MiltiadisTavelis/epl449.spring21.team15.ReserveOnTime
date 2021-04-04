loadPage()

function loadPage() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "reservations/all"
    }

    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText)

            if (response.hasOwnProperty("NoRsrvFound")) {
                let div = document.createElement("div")
                div.setAttribute("class", "alert alert-dark text-center")
                div.textContent = "You don't have any reservations."
                let contents = document.getElementById("contents")
                contents.appendChild(div)
            } else {
                loadRequests()
                loadTodayReservations()
                loadUpcomingReservations()
                loadHistoryReservations()
            }
        } else {
            popUpMessage("Can't load reservations. There was an unexpected error", "danger")
        }
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}

function loadTodayReservations() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "reservations/all",
        "today": "1",
        "status": "1"
    }

    xhr.onload = function() {
        loadManagerReservationSection(this, "today")
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}

function loadRequests() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "reservations/all",
        "status": "2",
        "sort": "oldest"
    }

    xhr.onload = function() {
        loadManagerReservationSection(this, "requests")
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}

function loadUpcomingReservations() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "reservations/all",
        "status": "1",
        "today": "2",
        "sort": "oldest"
    }

    xhr.onload = function() {
        loadManagerReservationSection(this, "upcoming")
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}

function loadHistoryReservations() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "reservations/all",
        "today": "0"
    }

    xhr.onload = function() {
        loadManagerReservationSection(this, "history")
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}