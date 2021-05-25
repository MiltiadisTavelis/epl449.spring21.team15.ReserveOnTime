var shop_id = null
checkSession("m", true)
loadPage()

const today = new Date();
today.setHours(0, 0, 0, 0);

$('.datefield').each(function(i, obj) {
    const picker = new Litepicker({ 
    element: this, 
    format: "DD MMM YYYY",
    singleMode: true,
    minDate: today,

  });
});

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

var currEventId = null;

$(document).on("click", "#submit-button-update", function() {
    updateEvent();
});

$(document).on("click", ".event-card", function() {
    var eventId = $(this).attr('card-event-id');
    currEventId = eventId;
    loadEventDet(eventId);
});

$(document).on("click", "#delete-event", function() {
    var r = confirm("Delete Event confirmation");
    if (r == true) {
        deleteEvent();
    }
});

$('#existing-events').on('hidden.bs.modal', function() {
    document.getElementById('modal-event-input').value = "";
    document.getElementById('modal-content-input').value = "";
    document.getElementById('modal-datefrom-input').value = "";
    document.getElementById('modal-dateto-input').value = "";
    document.getElementById('modal-timefrom-input').value = "";
    document.getElementById('modal-timeto-input').value = "";
    document.getElementById('modal-link-input').value = "";
});

var shopname;
var link = "";
//var pic="";

function submit() {

    var title = document.getElementById('title-input');
    var content = document.getElementById('content-input');
    var start_date = document.getElementById('datefrom-input');
    if(start_date.value.length === 0 ){
        popUpMessage("Missing start date information.", "danger");
        return;
    }
    var stop_date = document.getElementById('dateto-input');
    if(stop_date.value.length === 0 ){
        popUpMessage("Missing stop date information.", "danger");
        return;
    }
    var start_time = document.getElementById('timefrom-input');
    var stop_time = document.getElementById('timeto-input');
    link = document.getElementById('link-input');

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/create",
        "title": title.value,
        "content": content.value,
        "pic": "https://reserveontime.com/html/index.html",
        "link": link.value,
        "start_date": start_date.value,
        "stop_date": stop_date.value,
        "start_time": start_time.value,
        "stop_time": stop_time.value,
        "shop_id": shop_id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty("status")) {
                popUpMessage(response["status"], "danger");
            } else {
                popUpMessage(response["message"], "success");
                window.setTimeout(function() {
                    window.location = "shopevents.html";
                }, 1000);
            }
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function updateEvent() {

    var title = document.getElementById('modal-event-input');
    var content = document.getElementById('modal-content-input');
    var start_date = document.getElementById('modal-datefrom-input');
    if(start_date.value.length === 0 ){
        popUpMessage("Missing start date information.", "danger");
        return;
    }
    var stop_date = document.getElementById('modal-dateto-input');
    if(stop_date.value.length === 0 ){
        popUpMessage("Missing start date information.", "danger");
        return;
    }
    var start_time = document.getElementById('modal-timefrom-input');
    var stop_time = document.getElementById('modal-timeto-input');
    link = document.getElementById('modal-link-input');

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/update",
        "id": currEventId,
        "title": title.value,
        "content": content.value,
        "pic": "https://reserveontime.com/html/index.html",
        "link": link.value,
        "start_date": start_date.value,
        "stop_date": stop_date.value,
        "start_time": start_time.value,
        "stop_time": stop_time.value
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty("status")) {
                popUpMessage(response["status"], "danger");
            } else {
                popUpMessage(response["message"], "success");
                window.setTimeout(function() {
                    window.location = "shopevents.html";
                }, 1000);
            }
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('PUT', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];
const monthNamesLower = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

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



function loadEvents() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/shop",
        "shop_id": shop_id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var main = document.getElementById("event-card-section");

            if (response.hasOwnProperty('NoEventsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "There are no Events on the Shop.";
                main.appendChild(displayMessage);
                return;
            }

            var events = response["Events"];

            for (entry in events) {
                var event = events[entry]

                // CREATE ROW FOR EVERY EVENT
                var card = document.createElement("div");
                card.classList.add("event-card");
                card.setAttribute("card-event-id",event.id);
                main.appendChild(card);

                var modal = document.createElement("a");
                modal.setAttribute("href","#event-info-modal");
                modal.setAttribute("data-toggle","modal");
                modal.setAttribute("data-target","#event-info-modal");
                card.appendChild(modal);

                var start = new Date(event.start_date.replace(/-/g, "/"));

                var date = document.createElement("div"); 
                date.classList.add("event-date");
                card.appendChild(date)

                var day = document.createElement("h1");
                day.innerText = start.getDate();
                date.appendChild(day)

                var month = document.createElement("h4");
                month.innerText = monthNames[start.getMonth()];
                date.appendChild(month)

                var info = document.createElement("div"); 
                info.classList.add("event-info");
                card.appendChild(info)

                var title = document.createElement("h4");
                title.classList.add("title")
                title.innerText = event.title;
                info.appendChild(title)

                var eventcont = document.createElement("div"); 
                eventcont.classList.add("event-det");
                info.appendChild(eventcont)

                var content = document.createElement("p");
                content.innerText = event.content;
                eventcont.appendChild(content);

                if (event.link != "") {
                    var linkdiv = document.createElement("div");
                    linkdiv.classList.add("event-link");
                    card.appendChild(linkdiv);

                    var button = document.createElement("button");
                    button.setAttribute("type", "button");
                    button.classList.add("btn","btn-primary","float-right","event-link-btn");
                    button.innerText = "Link";
                    linkdiv.appendChild(button);
                }

                // start.getDate();
                // det.innerText = monthNames[start.getMonth()];
                // det.innerText = start.getFullYear();
                // var h = start.getHours();
                // var m = checkTime(start.getMinutes());
                // det.innerText = h + ":" + m;
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
                "type": "events/shop",
                "shop_id": shop_id
            }

            x.onload = function() {
                if (x.status === 200) {
                    events = JSON.parse(x.responseText)

                    loadEvents()
                    loadercount.plus = 1;

                } else {
                    loadercount.plus = 1;
                    popUpMessage("Can't load events. There was an unexpected error", "danger")
                }
            }

            x.withCredentials = true
            x.open('POST', api)
            x.setRequestHeader('Content-Type', 'application/json')
            x.send(JSON.stringify(data))
        } else {
            popUpMessage("Can't load events. There was an unexpected error", "danger")
        }
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}

function loadEventDet(eventId) {

    var title = document.getElementById('modal-event-input');
    var content = document.getElementById('modal-content-input');
    var start_date = document.getElementById('modal-datefrom-input');
    var stop_date = document.getElementById('modal-dateto-input');
    var start_time = document.getElementById('modal-timefrom-input');
    var stop_time = document.getElementById('modal-timeto-input');
    link = document.getElementById('modal-link-input');

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/event",
        "id": eventId
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            } else {
                title.value = response.title;
                content.value = response.content;
                start_date.value = convertDate(response.start_date);
                stop_date.value = convertDate(response.stop_date);
                start_time.value = response.start_time;
                stop_time.value = response.stop_time;
                
                if(response.link.length != 0){
                    link.value = response.link;
                }
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

function deleteEvent() {

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/delete",
        "id": currEventId
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            } else {
                popUpMessage(response["message"], "success");
                window.setTimeout(function() {
                    window.location = "shopevents.html";
                }, 1000);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('DELETE', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}