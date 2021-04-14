checkSession("m", true)

var image_type, image_length, w, h = null;
var cnt = 0;

var loadercount = {
  value: 0,
  set plus(value) {
    this.value += value;
    if(this.value == 7){
		$('#loading').fadeOut( "slow" );
		$('#contents').removeAttr('hidden');
    }
  }
}

function setDisableCheckboxes() {
    var checkboxes = document.getElementsByClassName("check");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function() {
            let day = this.id.split("-")[1]
            document.getElementById("time-" + day).disabled = !this.checked
        })
    }
    loadercount.plus = 1;
}

$(document).on('click', '.deletePreview', function() {
    if($(this).attr('image').localeCompare("loaded") == 0){
        var type = $(this).attr('imagetype');
        var num = $(this).attr('num');
        var id = '#preview-' + type + num;
        var src = $(id).children('img').attr('src');
        if(type.localeCompare("logo") == 0){
            deleteimage(1,src);
        }else if(type.localeCompare("thumbnail") == 0){
            deleteimage(2,src);
        }else{
            deleteimage(3,src);
        }
        $(id).remove();
    }else{
        var type = $(this).attr('imagetype');
        var num = $(this).attr('num');
        var id = '#preview-' + type + num;
        $(id).remove();
        id = "label-" + type;
        var l = document.getElementById(id).innerText;
        var v = document.getElementById(type).files[num-1].name;
        var removeValue = function(list, value, separator) {
            separator = separator || ",";
            var values = list.split(separator);
            for(var i = 0 ; i < values.length ; i++) {
                if(values[i] == value) {
                    values.splice(i, 1);
                    return values.join(separator);
                }
            }
            return list;
        }
        var inner = document.getElementById(id).innerText = removeValue(l,v,",");
        if(inner.length === 0){
            document.getElementById(id).innerText = "Upload a photo";
            document.getElementById(type).value = "";
        }
    }
});

$("#cancelCropBtn").click(function(){
    if(image_type.localeCompare("photo") == 0){
        var num = cnt;
        var id = id = "label-" + image_type;
        var l = document.getElementById(id).innerText;
        var v = document.getElementById(image_type).files[num-1].name;
        var removeValue = function(list, value, separator) {
            separator = separator || ",";
            var values = list.split(separator);
            for(var i = 0 ; i < values.length ; i++) {
                if(values[i] == value) {
                    values.splice(i, 1);
                    return values.join(separator);
                }
            }
            return list;
        }
        var inner = document.getElementById(id).innerText = removeValue(l,v,",");
        if(inner.length === 0){
            document.getElementById(id).innerText = "Upload a photo";
            document.getElementById(image_type).value = "";
        }
    }else{
        document.getElementById(image_type).value = "";
        var label = "label-" + image_type;
        document.getElementById(label).innerText = "Upload a photo";
    }
});

$('#logo').change(function() {
    var i = $(this).prev('label').clone();
    var file = $('#logo')[0].files[0].name;
    $(this).prev('label').text(file);
    image_length = 1;
});

$('#thumbnail').change(function() {
    image_length = 1;
    var i = $(this).prev('label').clone();
    var file = $('#thumbnail')[0].files[0].name;
    $(this).prev('label').text(file);
});

$('#photo').change(function() {
    var p = $(this).prev('label').clone();
    var images = $('#photo')[0].files
    var allfiles = "";
    for(var i=0; i<images.length; i++){
        if(i === (images.length-1)){
            allfiles += images[i].name;
        }else{
            allfiles += images[i].name + ',';
        }
    }
    $(this).prev('label').text(allfiles);
    image_length = images.length;
});

// Start upload preview image
var $uploadCrop, tempFilename, rawImg, imageId;
var allfiles;
function readFile(input) {
    if(image_type.localeCompare("thumbnail") == 0){
        $("preview-thumbnail-image").empty();
        createCroppie(690,265,true);
    }else if(image_type.localeCompare("logo") == 0){
        $("preview-logo-image").empty();
        createCroppie(200,200,false);
    }else{
        createCroppie(500,500,false);
    }

    if (input) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.upload-demo').addClass('ready');
            $('#cropImagePop').modal('show');
            rawImg = e.target.result;
        }
        reader.readAsDataURL(input);
    }
}

function createCroppie(a,b,c) {
    w = arguments[0];
    h = arguments[1];
    $('#upload-demo').croppie('destroy');
    $uploadCrop = $('#upload-demo').croppie({
                        viewport: {
                            width: w,
                            height: h,
                        },
                        boundary: {
                            width: (w+100),
                            height: (h+100),
                        },
                        enforceBoundary: arguments[2],
                        enableExif: true
                    });
}

$('#cropImagePop').on('shown.bs.modal', function() {
    $uploadCrop.croppie('bind', {
        url: rawImg
    });
});

$('#cropImagePop').on('hidden.bs.modal', function() {
    if(image_length != cnt ){
        readFile(allfiles[cnt]);
        cnt++;
    }
});

$('#cropImageBtn').on('click', function(ev) {
    $uploadCrop.croppie('result', {
        type: 'base64',
        format: 'jpeg',
        size: {
            width: w,
            height: h
        },
        backgroundColor:'white'
    }).then(function(resp) {
        var id = 'preview-'+image_type+'-image'
        var div = document.getElementById(id);
        var div_count = div.childElementCount;

        var divin = document.createElement("div");
        id = "preview-" + image_type + (div_count + cnt);
        divin.setAttribute("id",id);
        if(image_type.localeCompare("photo") == 0){
            divin.classList.add("photo-area","d-inline-block");
        }else if(image_type.localeCompare("logo") == 0){
            divin.classList.add("logo-area");
        }else{
            divin.classList.add("thumbnail-area");
        }

        var img = document.createElement("img");
        img.classList.add("gambar","img-responsive","img-thumbnail","embed-responsive-item");
        id = "image-preview-" + image_type;
        img.setAttribute("id",id);
        img.setAttribute("src",resp);
        img.setAttribute("image","submited");

        divin.appendChild(img);

        id = "#preview-" +image_type+ "-image";
        if(image_type.localeCompare("photo") != 0){
            $(id).empty();
        }else{
            var btn = document.createElement("a");
            btn.setAttribute("href","#");
            btn.setAttribute("style","display: inline;");
            btn.setAttribute("image","submited");
            btn.classList.add("deletePreview","btn","btn-default","fas","fa-trash-alt");
            btn.setAttribute("imagetype",image_type);
            btn.setAttribute("num",(div_count + cnt));
            divin.appendChild(btn);
        }

        div.appendChild(divin);
        $('#cropImagePop').modal('hide');
        var preview = "preview-" + image_type + "-image";
        document.getElementById(preview).hidden = false;
    });
});

$('.custom-file-input').on('change', function() {
    image_type = $(this).attr('id');
    imageId = $(this).data('id');
    tempFilename = $(this).val();
    $('#cancelCropBtn').data('id', imageId);        
    readFile(this.files[0]);
    cnt = 1;
    allfiles = this.files;
});

// End upload preview image

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
                setDisableCheckboxes();
                loadShopTypes();
                loadHours();
                loadLogo();
                loadThumbnail();
                loadImages();
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
    var days = ["Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday"];
    var calls = ["time-monday", "time-tuesday", "time-wednesday", "time-thursday", "time-friday", "time-saturday", "time-sunday"];
    var checkcalls = ["check-monday", "check-tuesday", "check-wednesday", "check-thursday", "check-friday", "check-saturday", "check-sunday"];
    var hourData = [];
    var pattern = /[0-9]{2}:[0-9]{2}\s*-\s*[0-9]{2}:[0-9]{2}(,\s*[0-9]{2}:[0-9]{2}\s*-\s*[0-9]{2}:[0-9]{2})*/;
    for (var i = 0; i < 7; i++) {

        var day = document.getElementById(calls[i]);
        if (day.value) {
            if (pattern.test(day.value)) {
                day = day.value.split(",");
                var leng = document.getElementById(calls[i]).value.split("-").length;
                var allhours = [];
                for (var j = 0; j < (leng - 1); j++) {
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
                if (leng > 1) {
                    var active = 0;
                    if (document.getElementById(checkcalls[i]).checked) {
                        active = 1
                    }
                    hourData.push({
                        "day": i + 1,
                        "active": active,
                        "hours": allhours
                    });
                }
            } else {
                popUpMessage(days[i] + ' ' + "has not valid pattern", "danger");
                day.setAttribute('novalidate', true);
                return;
            }
        } else {
            continue;
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
            submitDet();

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('PUT', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function submitDet() {
    var name = document.getElementById('shop-name-input');
    var type = document.getElementById('shop-type-input');
    var city = document.getElementById('shop-city-input');
    var area = document.getElementById('shop-area-input');
    var street = document.getElementById('shop-street-input');
    var zipcode = document.getElementById('shop-zipcode-input');
    var number = document.getElementById('shop-number-input');
    var tel = document.getElementById('shop-tel-input');
    var email = document.getElementById('shop-email-input');
    var description = document.getElementById('shop-description-input');

    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/shopdetails",
        "sname": name.value,
        "stype": type.value,
        "email": email.value,
        "pnum": tel.value,
        "city": city.value,
        "area": area.value,
        "street": street.value,
        "postcode": zipcode.value,
        "streetnum": number.value,
        "shop_id": shop_id,
        "description": description.value
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            } else {
                popUpMessage(response["message"], "success");
                submitImages();
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('PUT', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function submitImages() {
    var logo = document.getElementById("preview-logo-image");
    var thumbnail = document.getElementById("preview-thumbnail-image");
    var images = document.getElementById("preview-photo-image");
    if(logo.childElementCount+thumbnail.childElementCount+images.childElementCount === 0){return;}
    var formData = new FormData();
    var upload = false;
    var img = $("#preview-logo-image").find("img"),len = img.length;
    formData.append("logo",[]);
    if( len > 0 && img.attr('image').localeCompare("submited") == 0){
        upload = true;
        var src = img.first().attr("src");
        formData.append("logo",src);
    }

    var img = $("#preview-thumbnail-image").find("img"),len = img.length;
    formData.append("thumbnail",[]);
    if( len > 0 && img.attr('image').localeCompare("submited") == 0){
        upload = true;
        var src = img.first().attr("src");
        formData.append("thumbnail",src);
    }
    var img = document.getElementById("preview-photo-image");
    var divs = img.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i ++) {
        var check = divs[i].getElementsByTagName('img')[0].getAttribute("image");
        if(check.localeCompare("submited") == 0){
            upload = true;
            var src = divs[i].getElementsByTagName('img')[0].src;
            formData.append("photo[]",src);
        }
    }

    if(upload == false){
        return;
    }

    var xhr = new XMLHttpRequest();
    var data =  {
                    "type": "shops/addimages",
                    "shop_id": shop_id
                };
    formData.append("json", JSON.stringify(data));

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('status')) {
                popUpMessage(response["status"], "danger");
            } else {
                popUpMessage(response["message"], "success");
                setTimeout(function() {
                    location.reload();
                }, 2000);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.send(formData);
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
            } else {
                var hours = response["Hours"];
                var calls = ["time-monday", "time-tuesday", "time-wednesday", "time-thursday", "time-friday", "time-saturday", "time-sunday"];
                var checkcalls = ["check-monday", "check-tuesday", "check-wednesday", "check-thursday", "check-friday", "check-saturday", "check-sunday"];
                for (var i = 0; i < 7; i++) {
                    for (var j = 0; j < hours[i].length; j++) {
                        var day = hours[i];
                        var val = '';
                        for (var l = 1; l < day.length; l++) {
                            if (l === (day.length - 1)) {
                                val += day[l]['open'] + ' - ' + day[l]['close'];
                            } else {
                                val += day[l]['open'] + ' - ' + day[l]['close'] + ', ';
                            }
                        }
                        if (day[0]['active'] === 1) {
                            document.getElementById(checkcalls[i]).checked = true;
                            document.getElementById(calls[i]).disabled = false;
                        } else {
                            document.getElementById(checkcalls[i]).checked = false;
                            document.getElementById(calls[i]).disabled = true;
                        }
                        document.getElementById(calls[i]).value = val;
                    }
                }
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
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
        loadercount.plus = 1;
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
    var description = document.getElementById('shop-description-input');

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
                description.value = response.description;
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }
    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadLogo(){
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/images",
        "shop_id": shop_id,
        "image_type": 1
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                return;
            }
            var image = response.Images[0];
            createCroppie(200,200,false); 
            showimage(200,200,"logo",1,image.image_url)

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function loadImages(){
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/images",
        "shop_id": shop_id,
        "image_type": 3
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                return;
            }
            for (var i = 0; i < response.Images.length; i++) {
                var image = response.Images[i];
                createCroppie(500,500,false); 
                showimage(500,500,"photo",(i+1),image.image_url);
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function showimage(a,b,c,d,e){
    image_type = arguments[2];
    cnt = arguments[3];
    url = arguments[4];
    var id = 'preview-'+image_type+'-image'
    var div = document.getElementById(id);

    var divin = document.createElement("div");
    id = "preview-" + image_type + cnt
    divin.setAttribute("id",id);
    if(image_type.localeCompare("photo") == 0){
        divin.classList.add("photo-area","d-inline-block");
    }else if(image_type.localeCompare("logo") == 0){
        divin.classList.add("logo-area");
    }else{
        divin.classList.add("thumbnail-area");
    }

    var img = document.createElement("img");
    img.classList.add("gambar","img-responsive","img-thumbnail","embed-responsive-item");
    id = "image-preview-" + image_type;
    img.setAttribute("id",id);
    img.setAttribute("src",url);
    img.setAttribute("image","loaded");

    divin.appendChild(img);

    id = "#preview-" +image_type+ "-image";
    if(image_type.localeCompare("photo") != 0){
        $(id).empty();
    }else{
        var btn = document.createElement("a");
        btn.setAttribute("href","#");
        btn.setAttribute("style","display: inline;");
        btn.setAttribute("image","loaded");
        btn.classList.add("deletePreview","btn","btn-default","fas","fa-trash-alt");
        btn.setAttribute("imagetype",image_type);
        btn.setAttribute("num",cnt);
        divin.appendChild(btn);
    }
    div.appendChild(divin);
    var preview = "preview-" + image_type + "-image";
    document.getElementById(preview).hidden = false;
}

function loadThumbnail(){
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/images",
        "shop_id": shop_id,
        "image_type": 2
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                popUpMessage(response['status'],"danger");
                return;
            }
            var image = response.Images[0];
            createCroppie(690,265,false); 
            showimage(690,265,"thumbnail",1,image.image_url)

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
        loadercount.plus = 1;
    }

    xhr.withCredentials = true;
    xhr.open('POST', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function deleteimage(a,b){
    var xhr = new XMLHttpRequest();
    var data = {
        "type": "shops/deleteimage",
        "shop_id": shop_id,
        "image_type": arguments[0],
        "image_url": arguments[1]
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.hasOwnProperty('status')) {
                popUpMessage(response['status'],"danger");
                return;
            }
            popUpMessage(response['message'],"success");
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('DELETE', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}