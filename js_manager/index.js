loadPage()
var shop_id = null

function loadPage() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "users/shop"
    }

    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText)
            shop_id = response["shop_id"]

            let x = new XMLHttpRequest()
            let data = {
                "type": "reservations/all"
            }

            x.onload = function() {
                if (x.status === 200) {
                    let response = JSON.parse(x.responseText)

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

            x.withCredentials = true
            x.open('POST', api)
            x.setRequestHeader('Content-Type', 'application/json')
            x.send(JSON.stringify(data))
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
        "status": "1",
        "shop_id": shop_id
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
        "sort": "oldest",
        "shop_id": shop_id
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
        "sort": "oldest",
        "shop_id": shop_id
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
        "today": "0",
        "shop_id": shop_id
    }

    xhr.onload = function() {
        loadManagerReservationSection(this, "history")
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}