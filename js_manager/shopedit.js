checkSession("m", true)

window.addEventListener("load", function() {
    var checkboxes = document.getElementsByClassName("check");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function() {
            let day = this.id.split("-")[1]
            document.getElementById("time-" + day).disabled = !this.checked
        })
    }
});

var shop_id;
$(document).ready(function() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "users/shop"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            } else {
                shop_id = response.shop_id;
                loadShopTypes();
                loadHours();
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
});

function submit() {
    var calls = ["time-monday","time-tuesday","time-wednesday","time-thursday", "time-friday", "time-saturday", "time-sunday"];
    var checkcalls = ["check-monday","check-tuesday","check-wednesday","check-thursday", "check-friday", "check-saturday", "check-sunday"];
    var hourData = [];
    for (var i=0; i<7; i++) {

        var day = document.getElementById(calls[i]);
        if(day.value){
            day = day.value.split(",");
        }
        var leng = document.getElementById(calls[i]).value.split("-").length;
        var allhours = [];
        for(var j=0; j<(leng-1); j++){
            var hours = day[j].split("-");
            var open = hours[0];
            var close = hours[1];
            allhours[j] = {
                "open": open,
                "close": close,
                "split": 0,
                "active": 1
            };
        }
        if(leng > 1){
            var active = 0;
            if(document.getElementById(checkcalls[i]).checked){
                active = 1
            }
            hourData.push({
                "day": i+1,
                "active": active,
                "hours": allhours
            });
        }

    }

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/addhour",
        "shop_id": shop_id,
        "data": hourData
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            }

            popUpMessage(response["message"], "success");
            
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadHours() {
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/hours",
        "shop_id": shop_id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            }else{
                var hours = response["Hours"];
                var calls = ["time-monday","time-tuesday","time-wednesday","time-thursday", "time-friday", "time-saturday", "time-sunday"];
                var checkcalls = ["check-monday","check-tuesday","check-wednesday","check-thursday", "check-friday", "check-saturday", "check-sunday"];
                for (var i=0; i<7; i++) {
                    for (var j=0; j<hours[i].length; j++) {
                        var day = hours[i];
                        var val = '';
                        for(var l=1; l<day.length; l++){
                            if(l === (day.length-1)){
                                val += day[l]['open'] + ' - ' + day[l]['close'];
                            }else{
                                val += day[l]['open'] + ' - ' + day[l]['close'] + ', ';
                            }
                        }
                        if(day[0]['active'] === 1){
                            document.getElementById(checkcalls[i]).checked = true;
                        }else{
                            document.getElementById(checkcalls[i]).checked = false;
                        }
                        document.getElementById(calls[i]).value = val;
                    }
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
            loadDet();
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadDet() {
    var name = document.getElementById('shop-name-input');
    var type = document.getElementById('shop-type-input');
    var city = document.getElementById('shop-city-input');
    var area = document.getElementById('shop-area-input');
    var street = document.getElementById('shop-street-input');
    var zipcode = document.getElementById('shop-zipcode-input');
    var number = document.getElementById('shop-number-input');
    var tel = document.getElementById('shop-tel-input');
    var email = document.getElementById('shop-email-input');

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/shop",
        "id": shop_id
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
                window.setTimeout(function() {
                    window.location = "signin.html";
                }, 1000);
            } else {
                name.value = response.sname;
                type.value = response.stype_id;
                city.value = response.city_id;
                area.value = response.area;
                street.value = response.street;
                zipcode.value = response.postal_code;
                number.value = response.streetnum;
                tel.value = response.pnum;
                email.value = response.email;
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