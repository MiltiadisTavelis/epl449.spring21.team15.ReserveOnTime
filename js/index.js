checkSession("u", false)

const today = new Date();
today.setHours(0, 0, 0, 0);

$('[data-bss-hover-animate]')
        .mouseenter( function(){ var elem = $(this); elem.addClass('animated ' + elem.attr('data-bss-hover-animate')) })
        .mouseleave( function(){ var elem = $(this); elem.removeClass('animated ' + elem.attr('data-bss-hover-animate')) });

const picker = new Litepicker({ 
    element: document.getElementById('date-input'), 
    format: "DD/MM/YYYY",
    singleMode: true,
    minDate: today,
  });

var time = document.getElementById("time-input");
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

$(".select2").select2({
    minimumResultsForSearch: -1,
    closeOnSelect : true,
    allowClear: false,
    tags: true
});

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

const submitButton = document.getElementById('search-button');
submitButton.onclick = search;

opensession()
let session = -1;

function opensession() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/islogin"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            session = response.status;
            loadShopTypes();
            if(session === '1'){
                loadFavorites()
            }else{
                loadTopRatedShops()
                loadOpenShops()
                loadClosedShops()
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

function search() {
    event.preventDefault();
    event.stopPropagation();

    var date = document.getElementById('date-input');
    var time = document.getElementById('time-input');
    var city = document.getElementById('shop-city-input');
    var stype = document.getElementById('shop-type-input');
    var keyword = document.getElementById('keyword-input');

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/all",
        "date": date.value,
        "time": time.value,
        "city": city.value,
        "stype": stype.value,
        "sname": keyword.value
    };

    xhr.onload = function() {
        resultsSection = document.getElementById("results")
        if (results != null)
            removeAllChildNodes(resultsSection)
        loadShopSection(this, "results")
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadShopSection(xhr, sectionId) {
    var title = sectionId[0].toUpperCase() + sectionId.substring(1)

    if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText)
        let shops = response["Shops"]

        if (response.hasOwnProperty('NoShopsFound')) {
            if (sectionId === "results") {
                popUpMessage("No shops meet the above criteria", "danger")
            } else {
                popUpMessage("No " + sectionId + " shops were found", "danger")
            }
        } else {
            section = document.getElementById(sectionId)
            if (section === null) {
                throw new Error("Can't find section " + sectionId + " element to add the shop card.")
            }

            let header = document.createElement("div")
            header.setAttribute("id", sectionId + "-header")
            header.classList.add("bottom-border");
            let headerTitle = document.createElement("h1")
            headerTitle.textContent = title
            header.appendChild(headerTitle)
            if (sectionId === "results") {
                let subtextContent = document.createElement("h5")
                subtextContent.textContent = shops.length + " spots meet the above criteria"
                header.appendChild(subtextContent)
            }

            let display = document.createElement("div")
            display.setAttribute("id", sectionId + "-display")
            display.setAttribute("class", "shop-card-display")
            for (entry in shops) {
                display.appendChild(createShopCard(shops[entry],session,favorites))
            }

            section.appendChild(header)
            section.appendChild(display)
            section.classList.remove('d-none')
        }
    } else {
        popUpMessage("There was an unexpected error when loading the shops", "danger")
    }
    loadercount.plus = 1;
}

function loadShopTypes() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/types",
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var types = response["Types"];

            var comboBox = document.getElementById("shop-type-input");
            for (entry in types) {
                var type = document.createElement("option");
                type.text = types[entry].type;
                type.value = types[entry].id;
                comboBox.add(type);
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

let favorites = [];

function loadFavorites(){
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/favorites"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty("status")) {
                popUpMessage(response["status"], "danger");
            }else{
                favorites = response;
                loadTopRatedShops()
                loadOpenShops()
                loadClosedShops()
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

function loadTopRatedShops() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/all",
        "sort": "rating"
    };

    xhr.onload = function() {
        loadShopSection(this, "top")
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadOpenShops() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/all",
        "open": "1"
    };

    xhr.onload = function() {
        loadShopSection(this, "open")
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadClosedShops() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/all",
        "open": "0"
    };

    xhr.onload = function() {
        loadShopSection(this, "closed")
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}