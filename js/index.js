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

const submitButton = document.getElementById('submit-button');
submitButton.onclick = search;

formPage();
loadShopTypes();
loadTopRatedShops();
loadOpenShops();
loadClosedShops();

function formPage() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/islogin"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response["status"] === "1") {
                document.getElementById('account-btn').classList.remove('d-none')
                document.getElementById('reservations-btn').classList.remove('d-none')
                document.getElementById('signout-btn').classList.remove('d-none')
            } else {
                document.getElementById('signin-btn').classList.remove('d-none')
                document.getElementById('signup-btn').classList.remove('d-none')
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', 'https://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
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
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var shopDisplay = document.getElementById("search-shops");
            shopDisplay.classList.remove('d-none')
            removeAllChildNodes(shopDisplay)

            if (response.hasOwnProperty('NoShopsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "No shops meet the criteria";
                shopDisplay.appendChild(displayMessage);
                return
            }
            var shops = response["Shops"];

            for (entry in shops) {
                var shop = shops[entry]

                var shopCard = document.createElement("div");
                shopCard.classList.add('card');

                var cardImg = document.createElement("img");
                cardImg.classList.add('card-img-top');
                cardImg.src = "../images/shop_thumbnails/" + shop.id;
                shopCard.appendChild(cardImg);

                var cardBody = document.createElement("div");
                cardBody.classList.add('card-body');
                shopCard.appendChild(cardBody);

                var cardBodyTitle = document.createElement("h5");
                cardBodyTitle.classList.add('card-title');
                cardBodyTitle.innerHTML = shop.sname;
                cardBody.appendChild(cardBodyTitle);

                var cardBodyText = document.createElement('p');
                cardBodyText.classList.add('card-text');
                cardBodyText.innerHTML = shop.description;
                cardBody.appendChild(cardBodyText);

                var cardList = document.createElement('ul');
                cardList.classList.add('list-group', 'list-group-flush');
                shopCard.appendChild(cardList);

                var cardListType = document.createElement('li');
                cardListType.classList.add('list-group-item');
                cardListType.innerHTML = '<i class="fas fa-store"></i>   ' + shop.stype;
                cardList.appendChild(cardListType);

                var cardListRating = document.createElement('li');
                cardListRating.classList.add('list-group-item');
                cardListRating.innerHTML = '<i class="fas fa-star"></i>   ' + shop.rating;
                cardList.appendChild(cardListRating);

                var cardFooter = document.createElement('div');
                cardFooter.classList.add('card-body');
                shopCard.appendChild(cardFooter);

                var cardFooterLink = document.createElement('a');
                cardFooterLink.classList.add('card-link', 'btn', 'btn-lg', 'btn-dark');
                cardFooterLink.href = "shop.html?" + shop.id;
                cardFooterLink.text = "Book Now";
                cardFooter.appendChild(cardFooterLink);

                shopDisplay.appendChild(shopCard);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', 'https://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
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
    xhr.open('POST', 'https://api.reserveontime.com/action');
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
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var shopDisplay = document.getElementById("toprated-shops");
            if (response.hasOwnProperty('NoShopsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "There was an error.";
                shopDisplay.appendChild(displayMessage);
                return;
            }
            var shops = response["Shops"];

            for (entry in shops) {
                var shop = shops[entry]

                var shopCard = document.createElement("div");
                shopCard.classList.add('card');

                var cardImg = document.createElement("img");
                cardImg.classList.add('card-img-top');
                cardImg.src = "../images/shop_thumbnails/" + shop.id;
                shopCard.appendChild(cardImg);

                var cardBody = document.createElement("div");
                cardBody.classList.add('card-body');
                shopCard.appendChild(cardBody);

                var cardBodyTitle = document.createElement("h5");
                cardBodyTitle.classList.add('card-title');
                cardBodyTitle.innerHTML = shop.sname;
                cardBody.appendChild(cardBodyTitle);

                var cardBodyText = document.createElement('p');
                cardBodyText.classList.add('card-text');
                cardBodyText.innerHTML = shop.description;
                cardBody.appendChild(cardBodyText);

                var cardList = document.createElement('ul');
                cardList.classList.add('list-group', 'list-group-flush');
                shopCard.appendChild(cardList);

                var cardListType = document.createElement('li');
                cardListType.classList.add('list-group-item');
                cardListType.innerHTML = '<i class="fas fa-store"></i>   ' + shop.stype;
                cardList.appendChild(cardListType);

                var cardListRating = document.createElement('li');
                cardListRating.classList.add('list-group-item');
                cardListRating.innerHTML = '<i class="fas fa-star"></i>   ' + shop.rating;
                cardList.appendChild(cardListRating);

                var cardFooter = document.createElement('div');
                cardFooter.classList.add('card-body');
                shopCard.appendChild(cardFooter);

                var cardFooterLink = document.createElement('a');
                cardFooterLink.classList.add('card-link', 'btn', 'btn-lg', 'btn-dark');
                cardFooterLink.href = "shop.html?" + shop.id;
                cardFooterLink.text = "Book Now";
                cardFooter.appendChild(cardFooterLink);

                shopDisplay.appendChild(shopCard);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', 'https://api.reserveontime.com/action');
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
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var shopDisplay = document.getElementById("open-shops");
            if (response.hasOwnProperty('NoShopsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "There are currently no open shops.";
                shopDisplay.appendChild(displayMessage);
                return;
            }
            var shops = response["Shops"];

            for (entry in shops) {
                var shop = shops[entry]

                var shopCard = document.createElement("div");
                shopCard.classList.add('card');

                var cardImg = document.createElement("img");
                cardImg.classList.add('card-img-top');
                cardImg.src = "../images/shop_thumbnails/" + shop.id;
                shopCard.appendChild(cardImg);

                var cardBody = document.createElement("div");
                cardBody.classList.add('card-body');
                shopCard.appendChild(cardBody);

                var cardBodyTitle = document.createElement("h5");
                cardBodyTitle.classList.add('card-title');
                cardBodyTitle.innerHTML = shop.sname;
                cardBody.appendChild(cardBodyTitle);

                var cardBodyText = document.createElement('p');
                cardBodyText.classList.add('card-text');
                cardBodyText.innerHTML = shop.description;
                cardBody.appendChild(cardBodyText);

                var cardList = document.createElement('ul');
                cardList.classList.add('list-group', 'list-group-flush');
                shopCard.appendChild(cardList);

                var cardListType = document.createElement('li');
                cardListType.classList.add('list-group-item');
                cardListType.innerHTML = '<i class="fas fa-store"></i>   ' + shop.stype;
                cardList.appendChild(cardListType);

                var cardListRating = document.createElement('li');
                cardListRating.classList.add('list-group-item');
                cardListRating.innerHTML = '<i class="fas fa-star"></i>   ' + shop.rating;
                cardList.appendChild(cardListRating);

                var cardFooter = document.createElement('div');
                cardFooter.classList.add('card-body');
                shopCard.appendChild(cardFooter);

                var cardFooterLink = document.createElement('a');
                cardFooterLink.classList.add('card-link', 'btn', 'btn-lg', 'btn-dark');
                cardFooterLink.href = "shop.html?" + shop.id;
                cardFooterLink.text = "Book Now";
                cardFooter.appendChild(cardFooterLink);

                shopDisplay.appendChild(shopCard);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', 'https://api.reserveontime.com/action');
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
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            var shopDisplay = document.getElementById("closed-shops");
            if (response.hasOwnProperty('NoShopsFound')) {
                var displayMessage = document.createElement("div");
                displayMessage.classList.add('alert', 'alert-dark');
                displayMessage.innerHTML = "There are currently no closed shops.";
                shopDisplay.appendChild(displayMessage);
                return;
            }
            var shops = response["Shops"];

            for (entry in shops) {
                var shop = shops[entry]

                var shopCard = document.createElement("div");
                shopCard.classList.add('card');

                var cardImg = document.createElement("img");
                cardImg.classList.add('card-img-top');
                cardImg.src = "../images/shop_thumbnails/" + shop.id;
                shopCard.appendChild(cardImg);

                var cardBody = document.createElement("div");
                cardBody.classList.add('card-body');
                shopCard.appendChild(cardBody);

                var cardBodyTitle = document.createElement("h5");
                cardBodyTitle.classList.add('card-title');
                cardBodyTitle.innerHTML = shop.sname;
                cardBody.appendChild(cardBodyTitle);

                var cardBodyText = document.createElement('p');
                cardBodyText.classList.add('card-text');
                cardBodyText.innerHTML = shop.description;
                cardBody.appendChild(cardBodyText);

                var cardList = document.createElement('ul');
                cardList.classList.add('list-group', 'list-group-flush');
                shopCard.appendChild(cardList);

                var cardListType = document.createElement('li');
                cardListType.classList.add('list-group-item');
                cardListType.innerHTML = '<i class="fas fa-store"></i>   ' + shop.stype;
                cardList.appendChild(cardListType);

                var cardListRating = document.createElement('li');
                cardListRating.classList.add('list-group-item');
                cardListRating.innerHTML = '<i class="fas fa-star"></i>   ' + shop.rating;
                cardList.appendChild(cardListRating);

                var cardFooter = document.createElement('div');
                cardFooter.classList.add('card-body');
                shopCard.appendChild(cardFooter);

                var cardFooterLink = document.createElement('a');
                cardFooterLink.classList.add('card-link', 'btn', 'btn-lg', 'btn-dark');
                cardFooterLink.href = "shop.html?" + shop.id;
                cardFooterLink.text = "Book Now";
                cardFooter.appendChild(cardFooterLink);

                shopDisplay.appendChild(shopCard);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', 'https://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}