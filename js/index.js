checkSession("u", false)

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
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

const submitButton = document.getElementById('search-button');
submitButton.onclick = search;

loadShopTypes();
loadTopRatedShops()
loadOpenShops()
loadClosedShops()

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