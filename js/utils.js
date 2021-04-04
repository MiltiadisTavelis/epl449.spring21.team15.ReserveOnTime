function popUpMessage(textContent, type) {
    let message = document.createElement('div')
    message.setAttribute("class", "alert alert-" + type + " textContent-center popup")
    message.setAttribute("role", "alert")
    message.textContent = textContent
    let container = document.getElementById("contents")
    container.appendChild(message)

    $(".popup").delay(4000).fadeOut(function() {
        $(this).remove()
    })
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function createReservationsTable(sectionId, tableTitles) {
    let table = document.createElement("table")
    table.classList.add("table")
    table.classList.add("table-light")
    table.classList.add("reservation-table")
    table.setAttribute("id", sectionId + "-table")

    let head = document.createElement("thead")
    head.classList.add("thead-dark")
    let tr = document.createElement("tr")
    head.appendChild(tr)
    for (i = 0; i < tableTitles.length; i++) {
        let th = document.createElement("th")
        th.setAttribute("scope", "col")
        th.textContent = tableTitles[i]
        tr.append(th)
    }

    let th = document.createElement("th")
    th.setAttribute("scope", "col")
    if (sectionId === "history") {
        th.textContent = "Status"
    } else {
        th.textContent = ""
    }
    tr.append(th)

    let body = document.createElement("tbody")

    table.appendChild(head)
    table.appendChild(body)
    return table
}

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

            let table = createReservationsTable(sectionId, ["Shop", "Date/Time", "People"])
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
        acceptBtn.textContent = "accept"
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

            let table = createReservationsTable(sectionId, ["Name", "Phone #", "Date/Time", "People"])
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

function createShopCard(shop) {
    let shopCard = document.createElement("div")
    shopCard.classList.add('card')
    shopCard.classList.add('shop-card')

    let cardImg = document.createElement("img")
    cardImg.classList.add('card-img-top')
    cardImg.src = "../images/shop_thumbnails/" + shop.id
    shopCard.appendChild(cardImg)

    let cardBody = document.createElement("div")
    cardBody.classList.add('card-body')
    shopCard.appendChild(cardBody)

    let cardBodyTitle = document.createElement('p')
    cardBodyTitle.classList.add('card-title')
    cardBodyTitle.innerHTML = shop.sname
    cardBody.appendChild(cardBodyTitle)

    let cardBodyText = document.createElement('p')
    cardBodyText.classList.add('card-textContent')
    cardBodyText.innerHTML = shop.description
    cardBody.appendChild(cardBodyText)

    let cardList = document.createElement('ul')
    cardList.classList.add('list-group', 'list-group-flush')
    shopCard.appendChild(cardList)

    let cardListType = document.createElement('li')
    cardListType.classList.add('list-group-item')
    cardListType.innerHTML = '<i class="fas fa-store"></i>   ' + shop.stype
    cardList.appendChild(cardListType)

    let cardListRating = document.createElement('li')
    cardListRating.classList.add('list-group-item')
    cardListRating.innerHTML = '<i class="fas fa-star"></i>   ' + shop.rating
    cardList.appendChild(cardListRating)

    let cardFooter = document.createElement('div')
    cardFooter.classList.add('card-body')
    shopCard.appendChild(cardFooter)

    let cardFooterLink = document.createElement('a')
    cardFooterLink.classList.add('card-link', 'btn', 'btn-lg', 'btn-dark')
    cardFooterLink.href = "shop.html?" + shop.id
    cardFooterLink.textContent = "Book Now"
    cardFooter.appendChild(cardFooterLink)

    return shopCard
}

function loadShopSection(xhr, sectionId) {
    var title = sectionId[0].toUpperCase() + sectionId.substring(1)

    if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText)
        let shops = response["Shops"]

        if (response.hasOwnProperty('NoShopsFound')) {
            popUpMessage("No " + sectionId + "shops were found", "danger")
        } else {
            section = document.getElementById(sectionId)
            if (section === null) {
                throw new Error("Can't find section " + sectionId + " element to add the shop card.")
            }

            let header = document.createElement("div")
            header.setAttribute("id", sectionId + "-header")
            let headerTitle = document.createElement("h4")
            headerTitle.textContent = title
            header.appendChild(headerTitle)
            if (sectionId === "results") {
                let subtextContent = document.createElement("h5")
                subtextContent.textContent = shops.length + " spots meet the above criteria"
                header.appendChild(subtextContent)
            }
            header.appendChild(document.createElement("hr"))

            let display = document.createElement("div")
            display.setAttribute("id", sectionId + "-display")
            display.setAttribute("class", "shop-display")
            for (entry in shops) {
                display.appendChild(createShopCard(shops[entry]))
            }

            section.appendChild(header)
            section.appendChild(display)
            section.classList.remove('d-none')
        }
    } else {
        popUpMessage("There was an unexpected error when loading the shops", "danger")
    }
}