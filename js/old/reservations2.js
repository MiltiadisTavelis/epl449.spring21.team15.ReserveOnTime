checkSession("u", true)
loadPage()

function createReservationEntry(reservation, sectionId) {
    let tr = document.createElement("tr")
    tr.setAttribute("id", "reservation-" + reservation.id)

    let shopName = document.createElement("td")
    let shopLink = document.createElement("a")
    shopLink.href = "shop.html?" + reservation.shopid
    shopLink.textContent = reservation.sname
    shopName.appendChild(shopLink)
    tr.appendChild(shopName)

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

function loadReservationSection(xhr, sectionId) {
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

            let table = createBootstrapTable(sectionId, ["Shop", "Date/Time", "People"])
            let reservations = response["Reservations"]
            for (entry in reservations) {
                table.tBodies[0].appendChild(createReservationEntry(reservations[entry], sectionId))
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
                loadTodayReservations()
                loadPendingReservations()
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
        loadReservationSection(this, "today")
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}

function loadPendingReservations() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "reservations/all",
        "status": "2",
        "sort": "oldest"
    }

    xhr.onload = function() {
        loadReservationSection(this, "pending")
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
        loadReservationSection(this, "upcoming")
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
        loadReservationSection(this, "history")
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}