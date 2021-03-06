checkSession("u", true)
loadPage()

$('#loading').hide().fadeIn();
var loadercount = {
  value: 0,
  set plus(value) {
    this.value += value;
    if(this.value == 4){
        $('#loading').fadeOut();
        $('#contents').removeAttr('hidden').fadeIn("slow");
    }
  }
}

function createReservationEntry(reservation, sectionId) {
    let line = document.createElement("div")
    line.classList.add("reservation-line")
    line.setAttribute("id", "reservation-" + reservation.id)

    let shopName = document.createElement("span")
    shopName.classList.add("reservation-shop")
    let shopLink = document.createElement("a")
    shopLink.classList.add("shop-name")
    shopLink.href = "shop.html?" + reservation.shopid
    shopLink.textContent = reservation.sname
    shopName.appendChild(shopLink)
    line.appendChild(shopName)

    let dateTime = document.createElement("span")
    dateTime.classList.add("reservation-datetime")

    let stringTime = reservation.time.split(":")
    if (sectionId === "today") {
        dateTime.textContent = stringTime[0] + ":" + stringTime[1]
    } else {
        var date = new Date(reservation.day);
        dateTime.textContent = date.toLocaleString("en-us", {day: 'numeric'}) + " " + date.toLocaleString("en-us", {month: 'short'}) + " " + date.toLocaleString("en-us", {year: 'numeric'}) + ", " + stringTime[0] + ":" + stringTime[1]
    }
    line.appendChild(dateTime)

    let people = document.createElement("span")
    people.classList.add("reservation-people")
    people.textContent = reservation.people
    line.appendChild(people)

    let status = document.createElement("span")
    status.classList.add("reservation-status")
    line.appendChild(status)

    let visualStatus = document.createElement("div")
    if(reservation.status === "Canceled" || reservation.status === "Declined"){
        visualStatus.classList.add("visual-status","red-status")
    }else if(reservation.status === "Accepted"){
        visualStatus.classList.add("visual-status","green-status")
    }else{
        visualStatus.classList.add("visual-status")
    }
    line.appendChild(visualStatus)

    if (sectionId === "history") {
        status.textContent = reservation.status
    } else {
        let cancelBtn = document.createElement("button")
        cancelBtn.textContent = "Cancel"
        cancelBtn.setAttribute("class", "btn btn-primary option-btn")
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

        status.appendChild(cancelBtn)
    }

    return line
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
            header.classList.add("section-top")

            let headerTitle = document.createElement("span")
            headerTitle.classList.add("section-title")
            headerTitle.innerText = title
            header.appendChild(headerTitle)

            let sectionHeader = document.createElement("div")
            sectionHeader.classList.add("section-header")


            let table = ["Shop", "Date/Time", "People", "Options"]
            let tableClass= ["shop", "datetime", "people", "status"]

            if(title === "Today"){
                table = ["Shop", "Time", "People", "Options"];
            }else if(title === "History"){
                table = ["Shop", "Date/Time", "People", "Status"];
            }

            for(entry in table){
                let span = document.createElement("span")
                span.classList.add("reservation-"+tableClass[entry])
                span.innerText = table[entry]
                sectionHeader.appendChild(span)
            }

            let sectionContent = document.createElement("section-content")

            section.appendChild(header)
            section.appendChild(sectionHeader)
            section.appendChild(sectionContent)

            let reservations = response["Reservations"]
            for (entry in reservations) {
                sectionContent.appendChild(createReservationEntry(reservations[entry], sectionId))
            }

            section.classList.remove('d-none')
        }
    } else {
        popUpMessage("Can't load reservations. There was an unexpected error", "danger")
    }
    loadercount.plus = 1;
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
                $('#loading').fadeOut();
                $('#contents').removeAttr('hidden').fadeIn("slow");
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