checkSession("u", false)

const today = new Date();
today.setHours(0, 0, 0, 0);

const picker = new Litepicker({ 
    element: document.getElementById('date-req-input'), 
    format: "DD/MM/YYYY",
    singleMode: true,
    minDate: today,
  });

var time = document.getElementById("time-req-input");
var quarter = ["00", "15", "30", "45"];
for(var i=0; i<24; i++){
    for(var j=0; j<4; j++){
        var option = document.createElement("option");
        if(i<10){
            option.value = "0"+i+":"+quarter[j];
        }else{
            option.value = i+":"+quarter[j];
        }
        option.innerText = option.value;
        time.appendChild(option);
    }
}

$("#time-req-input").length && $("#time-req-input").select2({
        placeholder: "Pick a time",
        width: "100%",
        minimumResultsForSearch: 1 / 0
});

$("#people-input").length && $("#people-input").select2({
        placeholder: "People",
        width: "100%",
        minimumResultsForSearch: 1 / 0
});

const links = document.querySelectorAll('.navigation__link')

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if(!link.classList.contains('show')) {          
            const active = document.querySelector('.navigation__link.show');
            if(active !== null) {
                active.classList.remove('show');
                active.classList.remove('active');
            }
            link.classList.add('show');
            // if(link.getAttribute("href").localeCompare("#photoSlider") == 0){
            //     swiper.update();
            // }
        }
    })
})

$('#loading').hide().fadeIn();
var loadercount = {
  value: 0,
  set plus(value) {
    this.value += value;
    if(this.value == 7){
        $('#loading').fadeOut( "slow" );
        $('#contents').removeAttr('hidden');
    }
  }
}

var myRating = 1;
var shopname;
var address = "";
var url = window.location.href;
let id = url ? url.split('?').pop() : window.location.search.slice(1);

// isfull();
loadShopContent();
loadShopPhotos();
loadLogo();
loadThumbnail();
loadReviews();
loadEvents();
loadHours();

// function isonline() {
//     var xhr = new XMLHttpRequest();
//     var data = {
//         "type": "session/type"
//     };

//     xhr.onload = function() {
//         if (xhr.status === 200) {
//             var response = JSON.parse(xhr.responseText);
//             return typeof response.type !== 'undefined';
//         } else {
//             popUpMessage("There was an unexpected error", "danger");
//             return false;
//         }
//     }
//     xhr.withCredentials = true;
//     xhr.open('POST', api);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify(data));
// }

function loadHours() {
    var days = ["Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday"];
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/hours",
        "shop_id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var d = new Date();
            var main = document.getElementById("dateTime");
            var response = JSON.parse(xhr.responseText);
            for (var j=0; j<7; j++) {
                var hour = response.Hours[j];
                var divDayTime = document.createElement("div");
                divDayTime.setAttribute("id", days[j]);
                divDayTime.classList.add("day");
                if((d.getDay()-1) == j){
                    divDayTime.classList.add("today");
                }
                main.appendChild(divDayTime);

                var divDay = document.createElement("span");
                divDay.classList.add("float-left");
                divDay.innerText = days[j];
                divDayTime.appendChild(divDay);
                
                if(hour.length === 1 || hour[0].active === 0){
                    var divTime = document.createElement("span");
                    divTime.classList.add("float-right");
                    divTime.innerText = "Closed";
                    divDayTime.appendChild(divTime);

                    // var fix = document.createElement("span");
                    // fix.classList.add("clearfix");
                    // divDayTime.appendChild(fix);

                    main.appendChild(divDayTime);
                }
                for(var i=1; i<hour.length; i++){
                    if(hour[0].active === 1){
                        var divTime = document.createElement("span");
                        divTime.classList.add("float-right");
                        divTime.innerText = hour[i].open + ' - ' + hour[i].close;
                        divDayTime.appendChild(divTime);

                        if(i != hour.length-1){
                            var fix = document.createElement("span");
                            fix.classList.add("clearfix");
                            divDayTime.appendChild(fix);
                        }
                    }
                }
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

// function isfull() {
//     var xhr = new XMLHttpRequest();
//     var data = {
//         "type": "shops/isfull",
//         "shop_id": id
//     };

//     xhr.onload = function() {
//         if (xhr.status === 200) {
//             var response = JSON.parse(xhr.responseText);
//             var av = document.getElementById("available-status");

//             if (response.status === "Available") {
//                 av.classList.add("badge", "badge-success");
//                 av.innerText = "Available";
//             } else if (response.status === "Full") {
//                 av.classList.add("badge", "badge-danger");
//                 av.innerText = "Full";
//             }

//         } else {
//             popUpMessage("There was an unexpected error", "danger");
//         }
//         loadercount.plus = 1;
//     }
//     xhr.withCredentials = true;
//     xhr.open('POST', api);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify(data));
// }

function submit() {
    console.log()
    var people = $('#people-input').find(':selected').val();
    var day = document.getElementById('date-req-input');
    var time = $('#time-req-input').find(':selected').val();
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "reservations/create",
        "shop_id": id,
        "day": day.value,
        "time": time,
        "people": people

    };
   
    if(people.length === 0 || day.value.length === 0 || time.length === 0){
        popUpMessage("Please fill in all the required fields.", "danger");
        return;
    }else{
	    xhr.onload = function() {
	        if (xhr.status === 200) {
	            var response = JSON.parse(xhr.responseText);

	            if (response.hasOwnProperty('NotOnline')) {
	                window.setTimeout(function() {
	                    window.location = "signin.html";
	                }, 1000);
	            } else if (response.hasOwnProperty('message')) {
	                popUpMessage(response['message'], "success");
	                $("#reservation-btn").contents().filter(isTextNode).fadeOut('slow').remove();
	                $("#reservation-btn").addClass('success');
	                $("#reservation-btn").prop('disabled', true);
	                setTimeout(function() {
	                    window.location = "reservations.html"
	                }, 2000);
	            } else {
	                popUpMessage(response['status'], "danger");
	            }

	        } else {
	            popUpMessage("There was an unexpected error", "danger");
	        }
	    }
	}

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}


function loadShopContent() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/shop",
        "id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            //var name = document.getElementById("shop-name");
            if (response.hasOwnProperty('NoShopsFound')) {
                loadercount.plus = 1;
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "Null Shop";
                name.appendChild(displayMessage);
                return;
            }
            shopname = response.sname;
            address = address.concat(response.street," ",response.streetnum,", ",response.postal_code,", ",response.city);
            //name.innerText = response.sname;
            document.getElementById('ratetype').append(" " + response.rating + " | " + response.stype); //
            document.getElementById('description').innerText = response.description; //
            document.getElementById('address').append(" " + address);
            document.getElementById('googleloc').src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDhvJSUmZ8A2ZIuUElk-Qqd-yRNQN2Vq0M&q=" + shopname + "&zoom=18";

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}


function loadShopPhotos() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/images",
        "shop_id": id,
        "image_type": 3
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                loadercount.plus = 1;
                return;
            }

            var photos = document.getElementById("photos");

            var slider = document.createElement("div");
            slider.classList.add("swiper-wrapper");
            photos.appendChild(slider);

            var images = response["Images"];
            for (entry in images) {
                var image = images[entry];
                var p = document.createElement("div");
                p.classList.add("swiper-slide");
                slider.appendChild(p);

                var pi = document.createElement("img");
                pi.setAttribute("src",image["image_url"]);
                p.appendChild(pi);

            }
            
            var pagination = document.createElement("div");
            pagination.classList.add("swiper-pagination");
            photos.appendChild(pagination);

            const swiper = new Swiper('#photos',{
                pagination: {
                    el: '.swiper-pagination',
                },
                observer: true,
                observeParents: true,
                centeredSlides: true,
                paginationClickable: true,
                loop: true,
                slideToClickedSlide: true,
                slidesPerView: 1,
                breakpoints: {
                    450: {
                      slidesPerView: 2,
                        spaceBetweenSlides: 10
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetweenSlides: 10
                    },
                    1440: {
                      slidesPerView: 4,
                      spaceBetweenSlides: 30
                    }
                }
                
            });

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    var pictures = document.getElementById("photos");
    
}

function loadLogo(){

    var logo = document.getElementById("shop-image");

    str1 = "../images/shop_logos/";
    str2 = id;
    logo.setAttribute("src", str1.concat(str2));
    logo.setAttribute("style", "background-image: url(" + str1.concat(str2) + ")");
    loadercount.plus = 1;
}

function loadThumbnail(){

    var thumbnail = document.getElementById("cover-img");
    var blurthumbnail = document.getElementById("blur-cover-img");

    str1 = "../images/shop_thumbnails/";
    str2 = id;
    thumbnail.setAttribute("style", "background-image: url(" + str1.concat(str2) + ")");
    blurthumbnail.setAttribute("style", "background-image: url(" + str1.concat(str2) + ")");
    loadercount.plus = 1;
}

function loadReviews() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "reviews/shop",
        "shop_id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {

            var isonline = false;
            var xhr2 = new XMLHttpRequest();
            data = {
                "type": "session/type"
            };

            xhr2.onload = function() {
                if (xhr2.status === 200) {
                    var response = JSON.parse(xhr2.responseText);

                    if(typeof response.type === 'undefined'){
                        document.getElementsByClassName("review-create-btn")[0].parentNode.remove();
                    }

                    response = JSON.parse(xhr.responseText);

                    var main = document.getElementsByClassName("reviews-section")[0];

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
                        card.classList.add('reviews-card');
                        main.appendChild(card);

                        var wrap = document.createElement("div");
                        wrap.classList.add("f-wrap");
                        card.appendChild(wrap);

                        var name = document.createElement('span');
                        name.classList.add('reviews-user');
                        name.innerText = review.fname;
                        wrap.appendChild(name);

                        var rating = document.createElement('div');
                        rating.classList.add("reviews-rate");
                        for (var i = 1; i <= 5; i++) {
                            var star = document.createElement('i');
                            if (i <= parseInt(review.rating)) {
                                star.classList.add('fa', 'fa-star');
                            } else {
                                star.classList.add('fa', 'fa-star-o');
                            }
                            rating.appendChild(star);
                        }
                        wrap.appendChild(rating);

                        var time = document.createElement('span');
                        time.classList.add('reviews-submited');
                        time.innerText = review.sub_date.split(' ')[0];
                        rating.appendChild(time);

                        var description = document.createElement("div");
                        description.classList.add("reviews-content");
                        card.appendChild(description);

                        var descriptionContent = document.createElement('span');
                        descriptionContent.innerText = review.content;
                        description.appendChild(descriptionContent);
                    }
                } else {
                    popUpMessage("There was an unexpected error", "danger");
                }
            }
            xhr2.withCredentials = true;
            xhr2.open('POST', api);
            xhr2.setRequestHeader('Content-Type', 'application/json');
            xhr2.send(JSON.stringify(data));
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
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

$(document).on("click", ".event-card", function() {
    var eventId = $(this).attr('card-event-id');
    currEventId = eventId;
    loadEventDet(eventId);
    ///////////////////////////
});

let isTextNode = (_, el) => el.nodeType === Node.TEXT_NODE;
$('#event-info-modal').on('hidden.bs.modal', function() {
    $("#modal-event-title").contents().filter(isTextNode).remove();
    $("#modal-event-startdate").contents().filter(isTextNode).remove();
    $("#modal-event-starttime").contents().filter(isTextNode).remove();
    $("#modal-event-enddate").contents().filter(isTextNode).remove();
    $("#modal-event-endtime").contents().filter(isTextNode).remove();
    document.getElementById('modal-event-description').innerText = "";
    var link = document.getElementById('modal-event-link').href = "";
});

function loadEventDet(eventId) {

    var title = document.getElementById('modal-event-title');
    var content = document.getElementById('modal-event-description');
    var start_date = document.getElementById('modal-event-startdate');
    var stop_date = document.getElementById('modal-event-enddate');
    var start_time = document.getElementById('modal-event-starttime');
    var stop_time = document.getElementById('modal-event-endtime');
    link = document.getElementById('modal-event-link');

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
                title.prepend(response.title);
                content.prepend(response.content);
                start_date.prepend(response.start_date);
                stop_date.prepend(response.stop_date);
                start_time.prepend(response.start_time);
                stop_time.prepend(response.stop_time);
                
                if(response.link.length === 0){
                    link.hidden = true;
                }else{
                    link.hidden = false;
                    link.href = response.link;
                }
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}



function loadEvents() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "events/shop",
        "shop_id": id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var main = document.getElementById("event-card-section");

            if (response.hasOwnProperty('NoEventsFound')) {
                loadercount.plus = 1;
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
        loadercount.plus = 1;
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

$(document).on("click", ".star", function() {
    myRating = this.value;
});

$('.button-hold').click(function (){

    if($(this).attr('id') === "submit-review"){
        addReview();
    }else{
        submit();
    }

});

function addReview() {
    var content = document.getElementById('modal-content-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "reviews/creview",
        "shop_id": id,
        "content": content.value,
        "rating": myRating
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('NotOnline')) {
                popUpMessage(response['NotOnline'], "danger");
                window.setTimeout(function() {
                    window.location = "signin.html";
                }, 2000);
            }else if (response.hasOwnProperty('status')) {
                popUpMessage(response['status'], "danger");
            } else if (response.hasOwnProperty('message')) {
                popUpMessage(response['message'], "success");
                $("#submit-review").contents().filter(isTextNode).fadeOut('slow').remove();
                $("#submit-review").addClass('success');
                $("#submit-review").prop('disabled', true);
                setTimeout(function() {
                  location.reload();
                }, 2000);
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