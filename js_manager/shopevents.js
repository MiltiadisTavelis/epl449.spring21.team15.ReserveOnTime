var shop_id = null
checkSession("m", true)
loadPage()

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    maxViewMode: 2,
    weekStart: 1,
    startDate: "today",
    todayBtn: "linked",
    todayHighlight: true
});

$('.clockpicker').clockpicker({
    default: 'now',
    autoclose: true,
    donetext: ''
});

var shopname;
var link="";
//var pic="";

function submit() {
    
    var title = document.getElementById('title-input');
    var content = document.getElementById('content-input');
    var start_date = document.getElementById('datefrom-input');
    var stop_date = document.getElementById('dateto-input');
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
    console.log(data);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty("status")) {
                popUpMessage(response["status"], "success");
                window.setTimeout(function() {
                    window.location = "shopevents.html";
                }, 1000);
            } else {
                popUpMessage("Unexpected error", "danger");
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
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}



function loadEvents() {
    var url = window.location.href;
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/shop",
        "shop_id": shop_id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var main = document.getElementById("events");

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
                var list = document.createElement("div");
                list.classList.add("row", "mx-auto", "d-flex", "justify-content-center", "col-12");

                var card = document.createElement("article");
                card.classList.add("event-card", "fl");

                var date = document.createElement('section');
                date.classList.add("date");

                var start = new Date(event.start_date.replace(/-/g, "/"));

                var time = document.createElement("time");
                time.setAttribute("datetime", start.getDate() + " " + monthNames[start.getMonth()]);

                var day = document.createElement("span");
                day.innerText = start.getDate();

                var month = document.createElement("span");
                month.innerText = monthNames[start.getMonth()];

                time.appendChild(day);
                time.appendChild(month);
                date.appendChild(time);
                card.appendChild(date);

                var cont = document.createElement('section');
                cont.classList.add("card-cont");

                var name = document.createElement("small");
                name.innerText = shopname;
                cont.appendChild(name);

                var title = document.createElement("p");
                title.classList.add("title");
                title.innerText = event.title;
                cont.appendChild(title);

                var desc = document.createElement("p");
                desc.classList.add("desc");
                desc.innerText = event.content;
                cont.appendChild(desc);

                if (event.link != "") {
                    var button = document.createElement("a");
                    button.setAttribute("href", event.link);
                    button.innerText = "Link";
                    cont.appendChild(button);
                }

                // start.getDate();
                // det.innerText = monthNames[start.getMonth()];
                // det.innerText = start.getFullYear();
                // var h = start.getHours();
                // var m = checkTime(start.getMinutes());
                // det.innerText = h + ":" + m;

                card.appendChild(cont);
                list.appendChild(card);
                main.appendChild(list);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        var line = document.createElement('hr');
        line.classList.add('rate-hr');
        main.appendChild(line);
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

                } else {
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

