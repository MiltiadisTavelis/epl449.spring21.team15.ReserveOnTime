$(function(){
    
    let datePicker = document.getElementById('date-input');
    let picker = new Lightpick({
        field: datePicker,
        onSelect: function(date){
            datePicker.value = date.format('Do MMMM YYYY');
        }
    });
});

function submit() {
    var fname = document.getElementById('firstname-input');
    var surname = document.getElementById('lastname-input');
    var gender = document.getElementById('gender-input');
    var phone_code = "357";
    var number = document.getElementById('tel-input');
    var personal_email = document.getElementById('email-input');
    var sname = document.getElementById('shop-name-input');
    var stype = document.getElementById('shop-type-input');
    var city = document.getElementById('shop-city-input');
    var province = document.getElementById('shop-province-input');
    var address = document.getElementById('shop-address-input');
    var postcode = document.getElementById('shop-zipcode-input');
    var phone_code2 = "357";
    var shop_number = document.getElementById('shop-tel-input');
    var shop_email = document.getElementById('shop-email-input');
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "pendingShops/create",
        "fname": fname.value,
        "lname": surname.value,
        "gender": gender.value,
        "phone_code": phone_code,
        "number": number.value,
        "personal_email": personal_email.value,
        "sname": sname.value,
        "stype": stype.value,
        "city": city.value,
        "province": province.value,
        "address": address.value,
        "postcode": postcode.value,
        "phone_code2": phone_code2,
        "shop_number": shop_number.value,
        "shop_email": shop_email.value
    };


    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty("status")) {
                popUpMessage(response["status"], "success");
                window.setTimeout(function() {
                    window.location = "index.html";
                }, 3000);
                popUpMessage("Your Shop has been sent to our team!\nOur team will get back to you shortly. ", "success");
            } else {
                popUpMessage("Unexpected error", "danger");
            }
        } else {
            popUpMessage("Unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}