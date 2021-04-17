checkSession("a", true)
loadPage()

$('#loading').hide().fadeIn();
var loadercount = {
  value: 0,
  set plus(value) {
    this.value += value;
    if(this.value == 1){
        $('#loading').fadeOut( "slow" );
        $('#contents').removeAttr('hidden');
    }
  }
}

function createManagerReservationEntry() {
    var pendingShop = arguments[0];
    var accept = arguments[1];

    let tr = document.createElement("tr")

    if(accept){
        tr.setAttribute("id", "accept-" + pendingShop.id)
    }else{
        tr.setAttribute("id", "request-" + pendingShop.id)
    }


    let customerPcode = document.createElement("td")
    customerPcode.textContent = pendingShop.pcode
    tr.appendChild(customerPcode)

    let customerNumber = document.createElement("td")
    customerNumber.textContent = pendingShop.number
    tr.appendChild(customerNumber)

    let customerEmail = document.createElement("td")
    customerEmail.textContent = pendingShop.personal_email
    tr.appendChild(customerEmail)

    let shopName = document.createElement("td")
    shopName.textContent = pendingShop.sname
    tr.appendChild(shopName)

    let shopType = document.createElement("td")
    shopType.textContent = pendingShop.stype
    tr.appendChild(shopType)

    let info = document.createElement("td")
    let infoBtn = document.createElement("button")
    infoBtn.textContent = "Info"
    infoBtn.classList.add("btn","btn-primary")
    infoBtn.setAttribute("data-toggle","modal")
    infoBtn.setAttribute("data-target","#shop-info")
    infoBtn.setAttribute("id","info-" + pendingShop.id)

    infoBtn.onclick = function() {

            let xhr = new XMLHttpRequest()
            let pendingShopId = this.id.split("-")[1]

            let data = {
                "type": "pendingShops/all",
                "id": pendingShopId
            }

            xhr.onload = function() {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText)
                    if (response.hasOwnProperty("Shops")) {
                        let shop = response['Shops'][0];

                        let body = document.getElementById("modal-body")

                        let p = document.createElement("p")
                        p.textContent = "First name: " + shop['fname']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Last name: " + shop['lname']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Gender: " + shop['gender']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Phone code: " + shop['phone_code']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Number: " + shop['number']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Personal Email: " + shop['personal_email']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop name: " + shop['sname']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop type: " + shop['stype']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop city: " + shop['city']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop province: " + shop['province']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop address: " + shop['address']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop zipcode: " + shop['postcode']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop phone code: " + shop['phone_code2']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop number: " + shop['shop_number']
                        body.appendChild(p)

                        p = document.createElement("p")
                        p.textContent = "Shop email: " + shop['shop_email']
                        body.appendChild(p)

                        let options = document.getElementById("options")

                    if (shop['accepted'] === 0) {
                        let acceptBtn = document.createElement("button")
                        acceptBtn.textContent = "Accept"
                        acceptBtn.setAttribute("class", "btn btn-sm btn-success btn-accept")
                        acceptBtn.setAttribute("id", "accept-" + pendingShop.id)
                        acceptBtn.setAttribute("type", "button")
                        acceptBtn.onclick = function() {

                            let xhr = new XMLHttpRequest()
                            let pendingShopId = this.id.split("-")[1]

                            let data = {
                                "type": "pendingShops/accept",
                                "id": pendingShopId
                            }

                            xhr.onload = function() {
                                if (xhr.status === 200) {
                                    let response = JSON.parse(xhr.responseText)
                                    if (response.hasOwnProperty("status")) {
                                        popUpMessage(response['status'], "danger")
                                    }else{
                                        popUpMessage(response['message'], "success")
                                        setTimeout(function() {
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
                        options.appendChild(acceptBtn);

                    } else {
                        let cancelBtn = document.createElement("button")
                        cancelBtn.textContent = "Delete"
                        cancelBtn.setAttribute("class", "btn btn-sm btn-dark btn-cancel")
                        cancelBtn.setAttribute("id", "request-" + pendingShop.id)
                        cancelBtn.setAttribute("type", "button")
                        cancelBtn.onclick = function() {
                            let xhr = new XMLHttpRequest()

                            let pendingShopId = this.id.split("-")[1]

                            let data = {
                                "type": "pendingShops/delete",
                                "id": pendingShopId
                            }

                            xhr.onload = function() {
                                if (xhr.status === 200) {
                                    let response = JSON.parse(xhr.responseText)
                                    if (response.hasOwnProperty("status")) {
                                        popUpMessage(response['status'], "danger")
                                    }else{
                                        popUpMessage(response['message'], "success")
                                        setTimeout(function() {
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
                        options.appendChild(cancelBtn);
                    }

                    }else{
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

    info.appendChild(infoBtn)
    tr.appendChild(info)

    return tr
}

$('#shop-info').on('hidden.bs.modal', function() {
    let body = document.getElementById("modal-body")
    body.innerHTML = '';
    let options = document.getElementById("options")
    options.innerHTML = '';
});

function loadAdminPendingShopsSection(s) {
    section = document.getElementById("accepted")

    let header = document.createElement("div")
    header.setAttribute("id", "header")
    let headerTitle = document.createElement("h4")
    headerTitle.textContent = "Accepted";
    header.appendChild(headerTitle)
    let table = createBootstrapTable("Accepted", ["Phone Code", "Phone #", "Personal Email", "Shop name", "Shop type"])
    for (entry in s) {
       if(s[entry].accepted == 1){
            table.tBodies[0].appendChild(createManagerReservationEntry(s[entry],true))
       }
    }

    section.appendChild(header)
    section.appendChild(table)
    section.classList.remove('d-none')

    section = document.getElementById("requests")

    header = document.createElement("div")
    header.setAttribute("id", "header")
    headerTitle = document.createElement("h4")
    headerTitle.textContent = "Requests";
    header.appendChild(headerTitle)

    table = createBootstrapTable("Requests", ["Phone Code", "Phone #", "Personal Email", "Shop name", "Shop type"])
    for (entry in s) {
        if(s[entry].accepted == 0){
            table.tBodies[0].appendChild(createManagerReservationEntry(s[entry]),false)
        }
    }

    section.appendChild(header)
    section.appendChild(table)
    section.classList.remove('d-none')
}

function loadPage() {
    let xhr = new XMLHttpRequest()
    let data = {
        "type": "pendingShops/all"
    }

    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText)

            if (response.hasOwnProperty("NoShopsFound")) {
                let div = document.createElement("div")
                div.setAttribute("class", "alert alert-dark text-center")
                div.textContent = "There are no pending Shops."
                let contents = document.getElementById("contents")
                contents.appendChild(div)
            } else {
                loadercount.plus = 1;
                loadAdminPendingShopsSection(response["Shops"]);
            }
        } else {
            popUpMessage("Can't load pending Shops. There was an unexpected error", "danger")
        }
    }

    xhr.withCredentials = true
    xhr.open('POST', api)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}
