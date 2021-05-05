var shop_id = null
var reservations = null

checkSession("m", true)
loadPage()

$('#loading').hide().fadeIn();
var loadercount = {
  value: 0,
  set plus(value) {
    this.value += value;
    if(this.value == 6){
        $('#loading').fadeOut();
        $('#contents').removeAttr('hidden').fadeIn("slow");
    }
  }
}

function createReservationEntry(reservation, sectionId) {
    let line = document.createElement("div")
    line.classList.add("reservation-line")
    line.setAttribute("id", "reservation-" + reservation.id)

    let personName = document.createElement("span")
    personName.classList.add("reservation-name")
    personName.textContent = reservation.fname + " " + reservation.lname
    line.appendChild(personName)

    let personPhone = document.createElement("span")
    personPhone.classList.add("reservation-phone")
    personPhone.textContent = reservation.pnum
    line.appendChild(personPhone)

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
    } else if(sectionId === "requests") {
        let acceptBtn = document.createElement("button")
        acceptBtn.textContent = "Accept"
        acceptBtn.setAttribute("class", "btn btn-primary option-btn accept")
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
        declineBtn.setAttribute("class", "btn btn-primary option-btn decline")
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

        status.appendChild(acceptBtn)
        status.appendChild(declineBtn)
    }else {
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


            let table = ["Name","Phone #", "Date/Time", "People", "Options"]
            let tableClass= ["name", "phone", "datetime", "people", "status"]

            if(title === "Today"){
                table = ["Name","Phone #", "Time", "People", "Options"];
            }else if(title === "History"){
                table = ["Name","Phone #", "Date/Time", "People", "Status"];
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
            console.log(reservations)
            if(reservations !== undefined){
                section.classList.remove('d-none')
            }
            
        }
    } else {
        popUpMessage("Can't load reservations. There was an unexpected error", "danger")
    }
    loadercount.plus = 1;
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

                    if (reservations.hasOwnProperty("status")) {
                        let div = document.createElement("div")
                        div.setAttribute("class", "alert alert-dark text-center")
                        div.textContent = reservations["status"]
                        let contents = document.getElementById("contents")
                        contents.appendChild(div)

                        logout()
                    } else if (reservations.hasOwnProperty("NoRsrvFound")) {
                        let div = document.createElement("div")
                        div.setAttribute("class", "alert alert-dark text-center")
                        div.textContent = "There are no reservations."
                        let contents = document.getElementById("contents")
                        contents.appendChild(div)
                        $('#loading').fadeOut();
                        $('#contents').removeAttr('hidden').fadeIn("slow");
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
        loadReservationSection(this, "today")
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
        "today": "0",
        "shop_id": shop_id
    }

    xhr.onload = function() {
        loadReservationSection(this, "history")
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
        loadReservationSection(this, "requests")
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

    var xhr2 = new XMLHttpRequest();
    var data2 = {
        "type": "reviews/shop",
        "shop_id": shop_id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText)
            document.getElementById("stats-shopname").textContent = response.sname

            let total = reservations["Reservations"].length
            let acceptedCounter = 0
            let declinedCounter = 0
            let cancelledCounter = 0
            let pendingCounter = 0;
            for (let i = 0; i < total; i++) {
                let reservation = reservations["Reservations"][i]
                console.log(reservation.status)
                if (reservation.status === "Accepted") {
                    acceptedCounter++
                } else if (reservation.status === "Declined") {
                    declinedCounter++
                } else if (reservation.status === "Canceled") {
                    cancelledCounter++
                }else{
                    pendingCounter++
                }
            }
            console.log(total)
            console.log(acceptedCounter)
            console.log(declinedCounter)
            console.log(cancelledCounter)
            accepted_bar.animate(acceptedCounter / (total - pendingCounter));
            declined_bar.animate(declinedCounter/ (total - pendingCounter));
            cancelled_bar.animate(cancelledCounter/ (total - pendingCounter));  // Number from 0.0 to 1.0

            $("#shop-rating").append(response.rating);
        } else {
            popUpMessage("There was an unexpected error", "danger")
        }
        loadercount.plus = 1;
    }

    xhr2.onload = function() {
        if (xhr2.status === 200) {
            var response = JSON.parse(xhr2.responseText);

            let totalReviews = document.getElementById("total-number");

            var reviews = response["Reviews"];
            let total = reviews.length
            let posCounter = 0;
            let negCounter = 0;
            for (entry in reviews) {
                var review = reviews[entry]

                if (review.rating >= 3) {
                    posCounter++
                } else {
                    negCounter++
                }
            }

            positive_bar.animate(posCounter * 1 / total);
            negative_bar.animate(negCounter * 1 / total);  // Number from 0.0 to 1.0

            totalReviews.textContent = total
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))

    xhr2.withCredentials = true;
    xhr2.open('POST', api);
    xhr2.setRequestHeader('Content-Type', 'application/json');
    xhr2.send(JSON.stringify(data2));
}

var accepted_bar = new ProgressBar.Circle("#reservation-circle-accepted",{
  color: '#aaa',
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
      value: '0'
  },
  from: { color: '#ff7676', width: 4 },
  to: { color: '#81ff76', width: 4 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }
  }
});

var declined_bar = new ProgressBar.Circle("#reservation-circle-declined",{
  color: '#aaa',
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
      value: '0'
  },
  from: { color: '#ff7676', width: 4 },
  to: { color: '#81ff76', width: 4 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }
  }
});

var cancelled_bar = new ProgressBar.Circle("#reservation-circle-cancelled",{
  color: '#aaa',
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
      value: '0'
  },
  from: { color: '#ff7676', width: 4 },
  to: { color: '#81ff76', width: 4 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }
  }
});

var positive_bar = new ProgressBar.Circle("#reviews-circle-positive",{
  color: '#aaa',
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
      value: '0'
  },
  from: { color: '#ff7676', width: 4 },
  to: { color: '#81ff76', width: 4 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }
  }
});

var negative_bar = new ProgressBar.Circle("#reviews-circle-negative",{
  color: '#aaa',
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
      value: '0'
  },
  from: { color: '#ff7676', width: 4 },
  to: { color: '#81ff76', width: 4 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }
  }
});