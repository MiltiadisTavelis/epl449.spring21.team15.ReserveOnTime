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
    let message = document.createElement('div')
    message.setAttribute("class", "alert alert-" + type + " textContent-center popup")
    message.setAttribute("role", "alert")
    message.textContent = textContent
    let container = document.getElementById("contents")
    container.appendChild(message)

    $(".popup").delay(4000).fadeOut(function() {
        $(this).remove()
    })
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
    let shopCard = document.createElement("a")
    shopCard.href = "shop.html?" + shop.id
    shopCard.classList.add('card')
    shopCard.classList.add('shop-card')

    let cardImg = document.createElement("img")
    cardImg.classList.add('card-img-top')
    cardImg.src = "../images/shop_logos/" + shop.id
    shopCard.appendChild(cardImg)

    let cardBody = document.createElement("div")
    cardBody.classList.add('card-body')
    shopCard.appendChild(cardBody)

    let cardBodyTitle = document.createElement('p')
    cardBodyTitle.classList.add('card-title')
    cardBodyTitle.innerHTML = shop.sname
    cardBody.appendChild(cardBodyTitle)

    let cardBodyText = document.createElement('p')
    cardBodyText.classList.add('card-textContent')
    cardBodyText.innerHTML = shop.description
    cardBody.appendChild(cardBodyText)

    let cardList = document.createElement('ul')
    cardList.classList.add('list-group', 'list-group-flush')
    shopCard.appendChild(cardList)

    let cardListType = document.createElement('li')
    cardListType.classList.add('list-group-item')
    cardListType.innerHTML = '<i class="fas fa-store"></i>   ' + shop.stype
    cardList.appendChild(cardListType)

    let cardListRating = document.createElement('li')
    cardListRating.classList.add('list-group-item')
    cardListRating.innerHTML = '<i class="fas fa-star"></i>   ' + shop.rating + "/5"
    cardList.appendChild(cardListRating)

    return shopCard
}

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