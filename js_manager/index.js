var shop_id = null
var reservations = null

loadPage()

function createManagerReservationEntry(reservation, sectionId) {
    let tr = document.createElement("tr")
    tr.setAttribute("id", "reservation-" + reservation.id)

    let customerName = document.createElement("td")
    customerName.textContent = reservation.fname + " " + reservation.lname
    tr.appendChild(customerName)

    let customerNumber = document.createElement("td")
    customerNumber.textContent = reservation.pnum
    tr.appendChild(customerNumber)

    let dateTime = document.createElement("td")
    let stringTime = reservation.time.split(":")
    if (sectionId === "today") {
        dateTime.textContent = stringTime[0] + ":" + stringTime[1]
    } else {
        dateTime.textContent = reservation.day + " " + stringTime[0] + ":" + stringTime[1]
    }
    tr.appendChild(dateTime)

    let people = document.createElement("td")
    people.textContent = reservation.people
    tr.appendChild(people)

    if (sectionId === "history") {
        let status = document.createElement("td")
        status.textContent = reservation.status
        tr.appendChild(status)
    } else if (sectionId === "requests") {
        let decision = document.createElement("td")

        let acceptBtn = document.createElement("button")
        acceptBtn.textContent = "Accept"
        acceptBtn.setAttribute("class", "btn btn-sm btn-success btn-accept")
        acceptBtn.setAttribute("id", "accept-" + reservation.id)
        acceptBtn.setAttribute("type", "button")
        acceptBtn.onclick = function() {
            let xhr = new XMLHttpRequest()

            let reservationId = this.id.split("-")[1]
            let data = {
                "type": "reservations/status",
                "id": reservationId,
                "status": "1"
            }

            xhr.onload = function() {
                if (xhr.status === 200) {

                    popUpMessage("Succesfully accepted reservation!", "success")
                    setTimeout(function() {
                        window.location.reload()
                    }, 2000);
                } else {
                    popUpMessage("Couldn't accept reservation", "danger")
                }
            }

            xhr.withCredentials = true
            xhr.open('PUT', api)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(data))
        }

        let declineBtn = document.createElement("button")
        declineBtn.textContent = "Decline"
        declineBtn.setAttribute("class", "btn btn-sm btn-danger btn-decline")
        declineBtn.setAttribute("id", "decline-" + reservation.id)
        declineBtn.setAttribute("type", "button")
        declineBtn.onclick = function() {
            let xhr = new XMLHttpRequest()

            let reservationId = this.id.split("-")[1]
            let data = {
                "type": "reservations/status",
                "id": reservationId,
                "status": "0"
            }

            xhr.onload = function() {
                if (xhr.status === 200) {
                    popUpMessage("Succesfully declined reservation!", "success")
                    setTimeout(function() {
                        window.location.reload()
                    }, 2000);
                } else {
                    popUpMessage("Couldn't decline reservation", "danger")
                }
            }

            xhr.withCredentials = true
            xhr.open('PUT', api)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(data))
        }

        decision.appendChild(acceptBtn)
        decision.appendChild(declineBtn)
        tr.appendChild(decision)
    } else {
        let cancellation = document.createElement("td")
        let cancelBtn = document.createElement("button")
        cancelBtn.textContent = "Cancel"
        cancelBtn.setAttribute("class", "btn btn-sm btn-dark btn-cancel")
        cancelBtn.setAttribute("id", "cancel-" + reservation.id)
        cancelBtn.setAttribute("type", "button")
        cancelBtn.onclick = function() {
            let xhr = new XMLHttpRequest()

            let reservationId = this.id.split("-")[1]
            let data = {
                "type": "reservations/status",
                "id": reservationId,
                "status": "3"
            }

            xhr.onload = function() {
                if (xhr.status === 200) {

                    popUpMessage("Succesfully cancelled reservation!", "success")
                    setTimeout(function() {
                        window.location.reload()
                    }, 2000);
                } else {
                    popUpMessage("Couldn't cancel reservation", "danger")
                }
            }

            xhr.withCredentials = true
            xhr.open('PUT', api)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(data))
        }

        cancellation.appendChild(cancelBtn)
        tr.appendChild(cancellation)
    }

    return tr
}

function loadManagerReservationSection(xhr, sectionId) {
    var title = sectionId[0].toUpperCase() + sectionId.substring(1)

    if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText)

        if (!response.hasOwnProperty("NoRsrvFound")) {
            section = document.getElementById(sectionId)
            if (section === null) {
                throw new Error("Can't find section " + sectionId + " element to add the reservation table.")
            }

            let header = document.createElement("div")
            header.setAttribute("id", sectionId + "-header")
            let headerTitle = document.createElement("h4")
            headerTitle.textContent = title
            header.appendChild(headerTitle)

            let table = createBootstrapTable(sectionId, ["Name", "Phone #", "Date/Time", "People"])
            let reservations = response["Reservations"]
            for (entry in reservations) {
                table.tBodies[0].appendChild(createManagerReservationEntry(reservations[entry], sectionId))
            }

            section.appendChild(header)
            section.appendChild(table)
            section.classList.remove('d-none')
        }
    } else {
        popUpMessage("Can't load reservations. There was an unexpected error", "danger")
    }
}

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
                "type": "reservations/all",
                "shop_id": shop_id
            }

            x.onload = function() {
                if (x.status === 200) {
                    reservations = JSON.parse(x.responseText)

                    if (reservations.hasOwnProperty("NoRsrvFound")) {
                        let div = document.createElement("div")
                        div.setAttribute("class", "alert alert-dark text-center")
                        div.textContent = "There are no reservations."
                        let contents = document.getElementById("contents")
                        contents.appendChild(div)
                    } else {
                        loadStats()
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

function loadStats() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "shops/shop",
        "id": shop_id
    }

    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            document.getElementById("stats-shopname").textContent = response.sname + " Reservation Statistics"

            let totalDisplay = document.getElementById("stats-total")
            let acceptedDisplay = document.getElementById("stats-accepted")
            let declinedDisplay = document.getElementById("stats-declined")
            let cancelledDisplay = document.getElementById("stats-cancelled")

            let total = reservations["Reservations"].length
            let acceptedCounter = 0
            let declinedCounter = 0
            let cancelledCounter = 0

            for (let i = 0; i < total; i++) {
                let reservation = reservations["Reservations"][i]

                if (reservation.status === "Accepted") {
                    acceptedCounter++
                } else if (reservation.status === "Declined") {
                    declinedCounter++
                } else if (reservation.status === "Canceled") {
                    cancelledCounter++
                }
            }

            totalDisplay.textContent = total
            acceptedDisplay.textContent = acceptedCounter + " (" + Math.trunc(acceptedCounter * 100 / total) + "%)"
            declinedDisplay.textContent = declinedCounter + " (" + Math.trunc(declinedCounter * 100 / total) + "%)"
            cancelledDisplay.textContent = cancelledCounter + " (" + Math.trunc(cancelledCounter * 100 / total) + "%)"
            document.getElementById("stats").classList.remove('d-none')
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}