$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    startDate: "today",
    todayHighlight: true
});

$('.clockpicker').clockpicker({
    default: 'now',
    autoclose: true,
    donetext: ''
});

var shopname;

loadShopContent();

function loadShopContent() {
    var url = window.location.href;
    let id = url ? url.split('?').pop() : window.location.search.slice(1);
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/shop",
        "id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var name = document.getElementById("shop-name");
            if (response.hasOwnProperty('NoShopsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "Null Shop";
                name.appendChild(displayMessage);
                return;
            }
            shopname = response.sname;
            name.innerText = response.sname;
            document.getElementById('type').innerText = response.stype;
            document.getElementById('description').innerText = response.description;
            document.getElementById('rating').innerText = response.rating;

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

loadShopPhotos();

function loadShopPhotos() {
    var pictures = document.getElementById("photos");

    var carousel = document.createElement("div");
    carousel.setAttribute("id", "carousel");
    carousel.classList.add("carousel", "slide", "carousel-fade");
    carousel.setAttribute("data-ride", "carousel");

    var ol = document.createElement("ol");
    ol.classList.add("carousel-indicators");

    var li = document.createElement("li");
    li.setAttribute("data-slide-to", "0");
    li.setAttribute("data-target", "#carousel");
    li.classList.add("active");
    ol.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("data-slide-to", "1");
    li.setAttribute("data-target", "#carousel");
    ol.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("data-slide-to", "2");
    li.setAttribute("data-target", "#carousel");
    ol.appendChild(li);

    carousel.appendChild(ol);

    var photos = document.createElement("div");
    photos.classList.add("carousel-inner");
    photos.setAttribute("role", "listbox");

    var p = document.createElement("div");
    p.classList.add("carousel-item", "active");

    var pi = document.createElement("img");
    pi.classList.add("d-block", "w-100");
    pi.setAttribute("src", "https://dummyimage.com/200/000/fff&text=Test");
    p.appendChild(pi);
    photos.appendChild(p);

    p = document.createElement("div");
    p.classList.add("carousel-item");

    pi = document.createElement("img");
    pi.classList.add("d-block", "w-100");
    pi.setAttribute("src", "https://dummyimage.com/200/000/fff&text=Test2");
    p.appendChild(pi);
    photos.appendChild(p);

    p = document.createElement("div");
    p.classList.add("carousel-item");

    pi = document.createElement("img");
    pi.classList.add("d-block", "w-100");
    pi.setAttribute("src", "https://dummyimage.com/200/000/fff&text=Test3");
    p.appendChild(pi);
    photos.appendChild(p);

    carousel.appendChild(photos);

    var a = document.createElement("a");
    a.classList.add("carousel-control-prev");
    a.setAttribute("role", "button");
    a.setAttribute("href", "#carousel");
    a.setAttribute("data-slide", "prev");

    var span = document.createElement("span");
    span.classList.add("carousel-control-prev-icon");
    span.setAttribute("aria-hidden", "true");
    a.appendChild(span);
    span = document.createElement("span");
    span.classList.add("sr-only");
    span.innerText = "Preview";
    a.appendChild(span);

    carousel.appendChild(a);

    a = document.createElement("a");
    a.classList.add("carousel-control-next");
    a.setAttribute("role", "button");
    a.setAttribute("href", "#carousel");
    a.setAttribute("data-slide", "next");

    var span = document.createElement("span");
    span.classList.add("carousel-control-next-icon");
    span.setAttribute("aria-hidden", "true");
    a.appendChild(span);
    span = document.createElement("span");
    span.classList.add("sr-only");
    span.innerText = "Next";
    a.appendChild(span);

    carousel.appendChild(a);
    pictures.appendChild(carousel);

}

loadReviews();

function loadReviews() {
    var url = window.location.href;
    let id = url ? url.split('?').pop() : window.location.search.slice(1);
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "reviews/shop",
        "shop_id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var main = document.getElementById("reviews");

            if (response.hasOwnProperty('NoReviewsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "There are no Reviews on the Shop.";
                main.appendChild(displayMessage);
                return;
            }
            var reviews = response["Reviews"];

            for (entry in reviews) {
                var review = reviews[entry]

                // CREATE ROW FOR EVERY REVIEW
                var card = document.createElement("div");
                card.classList.add('review');

                var line = document.createElement('hr');
                line.classList.add('rate-hr');
                card.appendChild(line);

                var nameTime = document.createElement('div');
                //  nameTime.classList.add('d-flex','flex-column','pl-3');

                var name = document.createElement('p');
                name.classList.add('uname');
                name.innerText = review.fname;
                nameTime.appendChild(name);

                var time = document.createElement('small');
                time.classList.add('grey-text');
                time.innerText = review.sub_date.split(' ')[0];
                nameTime.appendChild(time);
                card.appendChild(nameTime);

                var rating = document.createElement('div');
                for (var i = 1; i <= 5; i++) {
                    if (i <= parseInt(review.rating)) {
                        var star = document.createElement('div');
                        star.classList.add('fa', 'fa-star', 'checked');
                    } else {
                        var star = document.createElement('div');
                        star.classList.add('fa', 'fa-star');
                    }
                    rating.appendChild(star);
                }
                card.appendChild(rating);


                var description = document.createElement("div");
                var descriptionContent = document.createElement('p');
                descriptionContent.classList.add('white-text');
                descriptionContent.innerText = review.content;
                description.appendChild(descriptionContent);
                card.appendChild(description);

                main.appendChild(card);
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

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

loadEvents();

function loadEvents() {
    var url = window.location.href;
    let id = url ? url.split('?').pop() : window.location.search.slice(1);
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/shop",
        "shop_id": id
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