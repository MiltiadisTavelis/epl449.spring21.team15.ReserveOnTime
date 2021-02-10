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
submitButton.onclick = submit;

loadHomeShops();
loadShopTypes();

function submit() {
    event.preventDefault();
    event.stopPropagation();

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/all"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var shops = response["Shops"];

            var shopDisplay = document.getElementById("shop-display");
            for (entry in shops) {
                console.log("Name: " + shops[entry].sname);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.open('POST', 'http://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadHomeShops() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/all",
        "open": "1"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var shops = response["Shops"];

            var shopDisplay = document.getElementById("shop-display");
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

    xhr.open('POST', 'http://api.reserveontime.com/action');
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
                comboBox.add(type);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.open('POST', 'http://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}