checkSession("a", true)
loadPage()

let array = ["Phone Code", "Phone #", "Personal Email", "Shop name", "Shop type", "Info"];
let classes = ["user-phonecode", "user-phone", "user-email", "user-shopname", "user-shoptype", "status"];

$('#loading').hide().fadeIn();
var loadercount = {
    value: 0,
    set plus(value) {
        this.value += value;
        if (this.value == 1) {
            $('#loading').fadeOut("slow");
            $('#contents').removeAttr('hidden');
        }
    }
}

function createManagerReservationEntry() {
    var pendingShop = arguments[0];
    var accept = arguments[1];

    let ret = [pendingShop.pcode, pendingShop.number, pendingShop.personal_email, pendingShop.sname, pendingShop.stype];

    let div = document.createElement("div")

    if (accept) {
        div.setAttribute("id", "accept-" + pendingShop.id)
    } else {
        div.setAttribute("id", "request-" + pendingShop.id)
    }

    div.setAttribute("class", "user-line")
    for (var i = 0; i < ret.length; i++) {
        let span = document.createElement("span")
        span.setAttribute("class", classes[i])
        span.innerText = ret[i];
        div.appendChild(span)
    }

    let info = document.createElement("div")
    info.setAttribute("class","status")
    let infoBtn = document.createElement("a")
    infoBtn.innerHTML = '<i class="fa fa-info"></i>'
    infoBtn.classList.add("option-btn", "info")
    infoBtn.setAttribute("data-toggle", "modal")
    infoBtn.setAttribute("data-target", "#info-modal")
    infoBtn.setAttribute("href","#info-modal")
    infoBtn.setAttribute("id", "info-" + pendingShop.id)
    info.appendChild(infoBtn)
    div.appendChild(info)

    infoBtn.onclick = function () {
        let modal = document.getElementById("modal-content")
        let xhr = new XMLHttpRequest()
        let pendingShopId = this.id.split("-")[1]

        let data = {
            "type": "pendingShops/all",
            "id": pendingShopId
        }

        xhr.onload = function () {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText)
                if (response.hasOwnProperty("Shops")) {
                    let shop = response['Shops'][0];

                    let informationListText = ["First name: ", "Last name: ", "Gender: ", "Phone code: ", "Number: ", "Personal Email: ", "Shop name: ", "Shop type: ", "Shop city: ", "Shop province: ", "Shop address: ", "Shop zipcode: ", "Shop phone code: ", "Shop number: ", "Shop email: "]
                    let informationList = [shop['fname'], shop['lname'], shop['gender'], shop['phone_code'], shop['number'], shop['personal_email'], shop['sname'], shop['stype'], shop['city'], shop['province'], shop['address'], shop['postcode'], shop['phone_code2'], shop['shop_number'], shop['shop_email']]
                    var close = document.createElement("button")
                    close.classList.add("btn", "btn-primary", "modal-exit")
                    close.setAttribute("type", "button")
                    close.setAttribute("data-dismiss", "modal")
                    close.innerHTML = '<i class="fas fa-times"></i>'
                    close.onclick = function () {
                        $('.modal').modal('hide');
                    }
                    modal.appendChild(close)

                    let list = document.createElement("div")
                    modal.appendChild(list)

                    let information = document.createElement("ul")
                    information.setAttribute("class", "list-unstyled")
                    list.appendChild(information)

                    for (var i = 0; i < informationListText.length; i++) {
                        let li = document.createElement("li")
                        information.appendChild(li)

                        let span = document.createElement("span")
                        li.appendChild(span)

                        span.append(informationListText[i])
                        li.append(informationList[i])
                    }

                    let buttonDiv = document.createElement("div")
                    buttonDiv.setAttribute("class", "button-status")

                    let btn = document.createElement("button")
                    buttonDiv.appendChild(btn)
                    information.appendChild(buttonDiv)
                    if (shop['accepted'] === 0) {

                        btn.textContent = "Accept"
                        btn.setAttribute("class", "btn btn-primary option-btn accept")
                        btn.setAttribute("id", "accept-" + pendingShop.id)
                        btn.setAttribute("type", "button")
                        btn.onclick = function () {

                            let xhr = new XMLHttpRequest()
                            let pendingShopId = this.id.split("-")[1]

                            let data = {
                                "type": "pendingShops/accept",
                                "id": pendingShopId
                            }

                            xhr.onload = function () {
                                if (xhr.status === 200) {
                                    let response = JSON.parse(xhr.responseText)
                                    if (response.hasOwnProperty("status")) {
                                        popUpMessage(response['status'], "danger")
                                    } else {
                                        popUpMessage(response['message'], "success")
                                        setTimeout(function () {
                                            window.location.reload()
                                        }, 2000);
                                    }
                                } else {
                                    popUpMessage("Couldn't accept pending Shop", "danger")
                                }
                            }

                            xhr.withCredentials = true
                            xhr.open('PUT', api)
                            xhr.setRequestHeader('Content-Type', 'application/json')
                            xhr.send(JSON.stringify(data))
                        }

                    } else {
                        btn.textContent = "Delete"
                        btn.setAttribute("class", "btn btn-primary option-btn delete")
                        btn.setAttribute("id", "delete-" + pendingShop.id)
                        btn.setAttribute("type", "button")

                        btn.onclick = function () {
                            let xhr = new XMLHttpRequest()

                            let pendingShopId = this.id.split("-")[1]

                            let data = {
                                "type": "pendingShops/delete",
                                "id": pendingShopId
                            }

                            xhr.onload = function () {
                                if (xhr.status === 200) {
                                    let response = JSON.parse(xhr.responseText)
                                    if (response.hasOwnProperty("status")) {
                                        popUpMessage(response['status'], "danger")
                                    } else {
                                        popUpMessage(response['message'], "success")
                                        setTimeout(function () {
                                            window.location.reload()
                                        }, 2000);
                                    }
                                } else {
                                    popUpMessage("Couldn't delete pending Shop", "danger")
                                }
                            }

                            xhr.withCredentials = true
                            xhr.open('DELETE', api)
                            xhr.setRequestHeader('Content-Type', 'application/json')
                            xhr.send(JSON.stringify(data))
                        }
                    }
                    $('.modal').modal('show');
                } else {
                    popUpMessage("No info found", "danger")
                }
            } else {
                popUpMessage("Couldn't load pending Shop info", "danger")
            }
        }
        xhr.withCredentials = true
        xhr.open('POST', api)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))
    }
    return div
}

$('#info-modal').on('hidden.bs.modal', function () {
    let body = document.getElementById("modal-content")
    body.innerHTML = '';
});

function loadAdminPendingShopsSection(s) {
    section = document.getElementById("accepted")

    let header = document.createElement("div")
    header.setAttribute("class", "section-top")
    let headerTitle = document.createElement("span")
    headerTitle.textContent = "Accepted";
    headerTitle.setAttribute("class", "section-title");
    header.appendChild(headerTitle)

    let table = document.createElement('div');
    table.setAttribute("class", "section-header")
    for (var i = 0; i < array.length; i++) {
        let span = document.createElement("span")
        span.setAttribute("class", classes[i])
        span.innerText = array[i];
        table.appendChild(span)
    }

    let content = document.createElement("div")
    content.setAttribute("class", "section-content")

    for (entry in s) {
        if (s[entry].accepted == 1) {
            content.appendChild(createManagerReservationEntry(s[entry], true))
        }
    }

    section.appendChild(header)
    section.appendChild(table)
    section.appendChild(content)
    section.classList.remove('d-none')

    section = document.getElementById("requests")

    header = document.createElement("div")
    header.setAttribute("class", "section-top")
    headerTitle = document.createElement("span")
    headerTitle.textContent = "Requests";
    headerTitle.setAttribute("class", "section-title");
    header.appendChild(headerTitle)

    table = document.createElement('div');
    table.setAttribute("class", "section-header")
    for (var i = 0; i < array.length; i++) {
        let span = document.createElement("span")
        span.setAttribute("class", classes[i])
        span.innerText = array[i];
        table.appendChild(span)
    }

    content = document.createElement("div")
    content.setAttribute("class", "section-content")

    for (entry in s) {
        if (s[entry].accepted == 0) {
            content.appendChild(createManagerReservationEntry(s[entry]), false)
        }
    }

    section.appendChild(header)
    section.appendChild(table)
    section.appendChild(content)
    section.classList.remove('d-none')
}

function loadPage() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "pendingShops/all"
    }

    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText)

            if (response.hasOwnProperty("NoShopsFound")) {
                let div = document.createElement("div")
                div.setAttribute("class", "alert alert-dark text-center")
                div.textContent = "There are no pending Shops."
                let contents = document.getElementById("contents")
                contents.appendChild(div)
            } else {
                loadAdminPendingShopsSection(response["Shops"]);
            }
        } else {
            popUpMessage("Can't load pending Shops. There was an unexpected error", "danger")
        }
        loadercount.plus = 1;
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}