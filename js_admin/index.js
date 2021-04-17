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

    let customerName = document.createElement("td")
    customerName.textContent = pendingShop.fname + " " + pendingShop.lname
    tr.appendChild(customerName)

    let customerGender = document.createElement("td")
    customerGender.textContent = pendingShop.gender
    tr.appendChild(customerGender)

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

    let shopCity = document.createElement("td")
    shopCity.textContent = pendingShop.city
    tr.appendChild(shopCity)

    let shopProvince = document.createElement("td")
    shopProvince.textContent = pendingShop.province
    tr.appendChild(shopProvince)

    let shopAddress = document.createElement("td")
    shopAddress.textContent = pendingShop.address
    tr.appendChild(shopAddress)

    let shopPostal = document.createElement("td")
    shopPostal.textContent = pendingShop.postcode
    tr.appendChild(shopPostal)

    let shopPhonecode = document.createElement("td")
    shopPhonecode.textContent = pendingShop.shop_pcode
    tr.appendChild(shopPhonecode)

    let shopPhone = document.createElement("td")
    shopPhone.textContent = pendingShop.shop_number
    tr.appendChild(shopPhone)

    let shopEmail = document.createElement("td")
    shopEmail.textContent = pendingShop.shop_email
    tr.appendChild(shopEmail)


    if (pendingShop.accepted === 0) {
        let decision = document.createElement("td")
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

        decision.appendChild(acceptBtn)
        tr.appendChild(decision)
    } else {
        let cancellation = document.createElement("td")
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

        cancellation.appendChild(cancelBtn)
        tr.appendChild(cancellation)
    }

    return tr
}

function loadAdminPendingShopsSection(s) {
    section = document.getElementById("accepted")

    let header = document.createElement("div")
    header.setAttribute("id", "header")
    let headerTitle = document.createElement("h4")
    headerTitle.textContent = "Accepted";
    header.appendChild(headerTitle)
    let table = createBootstrapTable("Accepted", ["Name", "Gender", "Phone Code", "Phone #", "Personal Email", "Shop name", "Shop type", "City", "Province", "Address", "Zipcode", "Shop Phone Code", "Shop number", "Shop email"])
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

    table = createBootstrapTable("Requests", ["Name", "Gender", "Phone Code", "Phone #", "Personal Email", "Shop name", "Shop type", "City", "Province", "Address", "Zipcode", "Shop Phone Code", "Shop number", "Shop email"])
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
