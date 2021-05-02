function checkSession(type, redir) {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/type"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty("type")) {
                if (response["type"] !== type) {
                    logout()
                }
            } else {
                if (redir) {
                    window.location = "signin.html"
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

function removeDoubleSession() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "session/type"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty("type")) {
                logout()
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

function popUpMessage(textContent, type) {

    let div = document.createElement('div')
    div.classList.add("d-flex","justify-content-center")
    div.setAttribute('id','popup')


    let popup = document.createElement('div')
    popup.classList.add("toast","fade", "hide", "d-flex")
    popup.setAttribute("role", "alert")
    popup.setAttribute("data-delay","4000")
    popup.setAttribute("id","popup-alert")
    div.appendChild(popup)

    let statusIcon = document.createElement('i')
    if(type.localeCompare("success") == 0){
        statusIcon.classList.add('fa','fa-check-circle')
        statusIcon.setAttribute('id','success-popup')
    }else{
        statusIcon.classList.add('fa','fa-times-circle')
        statusIcon.setAttribute('id','danger-popup')
    }
    popup.appendChild(statusIcon)

    let message = document.createElement('span')
    message.setAttribute("style","margin-left: 10px;")
    message.textContent = textContent
    popup.appendChild(message)

    let container = document.getElementById("contents")
    container.appendChild(div)

    $('.toast').toast('show').delay(4000).fadeOut(function() {
        $("#popup").remove()
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function createBootstrapTable(sectionId, tableTitles) {
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

function createShopCard(shop) {
    let shopCard = document.createElement("div")
    shopCard.classList.add('card','shop-card')

    let link = document.createElement("a")
    link.href = "shop.html?" + shop.id;
    shopCard.appendChild(link)

    let cardImg = document.createElement("div")
    cardImg.classList.add('shop-card-image')
    var imgurl = "background: url(../images/shop_logos/" + shop.id + ") center / cover;";
    cardImg.setAttribute("style",imgurl);
    shopCard.appendChild(cardImg)

    let favorite = document.createElement("div")
    favorite.classList.add("shop-card-favorite")
    shopCard.appendChild(favorite)

    let favoriteBtn = document.createElement("button")
    favoriteBtn.classList.add("btn","btn-primary","shop-card-favorite-button")
    favoriteBtn.setAttribute("data-bss-hover-animate","pulse")
    favoriteBtn.setAttribute("type","button")
    favorite.appendChild(favoriteBtn)

    let favoriteBtnImg = document.createElement("i")
    favoriteBtnImg.classList.add("far","fa-heart","shop-card-favorite-icon")
    favoriteBtn.appendChild(favoriteBtnImg)

    let cardBody = document.createElement("div")
    cardBody.classList.add('card-body','shop-card-body')
    shopCard.appendChild(cardBody)

    let shopCardDetails = document.createElement("div")
    shopCardDetails.classList.add("shop-card-details")
    cardBody.appendChild(shopCardDetails)

    let shopType = document.createElement("span")
    shopType.classList.add("shop-card-type")
    shopCardDetails.appendChild(shopType)

    let iconStore = document.createElement("i")
    iconStore.classList.add("fas","fa-store")
    shopType.appendChild(iconStore)
    shopType.append(' ' + shop.stype)

    let shopName = document.createElement('h3')
    shopName.classList.add('shop-card-name')
    shopName.innerHTML = shop.sname
    shopCardDetails.appendChild(shopName)

    let shopRating = document.createElement('p')
    shopRating.classList.add('text-truncate','shop-card-rating')
    for (var i = 0; i < 5; i++) {
        if(shop.rating >= i){
            let iconStore = document.createElement("i")
            iconStore.classList.add("fa","fa-star")
            shopRating.appendChild(iconStore)
        }else{
            let iconStore = document.createElement("i")
            iconStore.classList.add("fa","fa-star-o")
            shopRating.appendChild(iconStore)
        }
    }
    shopCardDetails.appendChild(shopRating)

    let shopAddress = document.createElement('p')
    shopAddress.classList.add('text-truncate', "shop-card-location")
    shopCardDetails.appendChild(shopAddress)

    let shopAddressIcon = document.createElement('i')
    shopAddressIcon.classList.add("fas","fa-map-marker-alt")
    shopAddress.appendChild(shopAddressIcon)
    shopAddress.append(' ' + shop.street + ', ' + shop.streetnum + ', ' + shop.city)

    let shopReserveBtn = document.createElement('span')
    shopReserveBtn.classList.add("btn","btn-primary","shop-card-button")
    shopReserveBtn.innerHTML = "Reserve Now"
    cardBody.appendChild(shopReserveBtn)

    return shopCard
}

// function createShopCard(shop) {
//     let shopCard = document.createElement("a")
//     shopCard.href = "shop.html?" + shop.id
//     shopCard.classList.add('card')
//     shopCard.classList.add('shop-card')

//     let cardImg = document.createElement("img")
//     cardImg.classList.add('card-img-top')
//     cardImg.src = "../images/shop_logos/" + shop.id
//     shopCard.appendChild(cardImg)

//     let cardBody = document.createElement("div")
//     cardBody.classList.add('card-body')
//     shopCard.appendChild(cardBody)

//     let cardBodyTitle = document.createElement('p')
//     cardBodyTitle.classList.add('card-title')
//     cardBodyTitle.innerHTML = shop.sname
//     cardBody.appendChild(cardBodyTitle)

//     //let cardBodyText = document.createElement('p')
//     //cardBodyText.classList.add('card-textContent')
//     //cardBodyText.innerHTML = shop.description
//     //cardBody.appendChild(cardBodyText)

//     let cardList = document.createElement('ul')
//     cardList.classList.add('list-group', 'list-group-flush')
//     cardBody.appendChild(cardList)

//     let cardListType = document.createElement('li')
//     cardListType.classList.add('list-group-item')
//     cardListType.innerHTML = '<i class="fas fa-store"></i> ' + shop.stype
//     cardList.appendChild(cardListType)

//     let cardListRating = document.createElement('li')
//     cardListRating.classList.add('list-group-item')
//     cardListRating.innerHTML = '<i class="fas fa-star"></i> ' + shop.rating + "/5"
//     cardList.appendChild(cardListRating)

//     return shopCard
// }

function addButtonTo(element, text, callback) {
    if (element.id === null) {
        throw new Error("Parent element has no id.")
    }

    let cancelBtn = document.createElement("button")
    cancelBtn.textContent = text
    cancelBtn.setAttribute("class", "btn btn-sm btn-dark textContent-center")
    cancelBtn.setAttribute("id", "btn-action-" + element.id)
    cancelBtn.setAttribute("type", "button")
    cancelBtn.onclick = callback

    element.appendChild(cancelBtn)
}