checkSession("m", true)

$('#loading').hide().fadeIn();
var loadercount = {
  value: 0,
  set plus(value) {
    this.value += value;
    if(this.value == 6){
        $('#loading').fadeOut( "slow" );
        $('#contents').removeAttr('hidden');
    }
  }
}

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
                loadShopTypes()
                loadHours() 
                loadLogo()
                loadImages()
                loadThumbnail()
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
            showimage(image.image_url,"thumbnail");

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
                showimage(image.image_url,"photo");
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

function showimage(a,b){
    image_type = arguments[1];
    url = arguments[0];
    if(image_type === 'photo'){
        var imgpackage = document.createElement("div")
        imgpackage.classList.add("image-package")
        
        var img = document.createElement("img")
        img.classList.add("preview-sqr")
        img.src = url;
        img.setAttribute("image","loaded")
        imgpackage.appendChild(img)
        
        var button = document.createElement("button")
        button.classList.add("img-delete")
        button.setAttribute("type","button")
        button.innerHTML = '<i class="fas fa-times"></i>'
        imgpackage.appendChild(button)
        button.addEventListener('click', function() {
            if($(this).parent().children('img').attr('image').localeCompare("loaded") == 0){
                var src = $(this).parent().children('img').attr('src');
                deleteimage(3,src);
                // if(type.localeCompare("logo") == 0){
                //     deleteimage(1,src);
                // }else if(type.localeCompare("thumbnail") == 0){
                //     deleteimage(2,src);
                // }else{
                //     deleteimage(3,src);
                // }
            }
            $(this).parent().remove(); 
        }, false);
        
        document.getElementById('preview-photo-section').appendChild(imgpackage)
    }else{
        var imgpackage = document.createElement("div")
        imgpackage.classList.add("image-package")
        
        var img = document.createElement("img")
        img.classList.add("preview-thumb")
        img.src = url;
        img.setAttribute("image","loaded")
        img.setAttribute("id","preview-thumbnail")
        imgpackage.appendChild(img)
        
        document.getElementById('preview-thumbnail-section').appendChild(imgpackage)
    }
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
            document.getElementById("preview-logo").src = image.image_url

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

const links = document.querySelectorAll('.navigation__modal')
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const active = document.querySelector('.navigation__modal.active');
        if(active !== null) {
            active.classList.remove('active');
        }
    })
})

$("#shop-type-input").length && $("#shop-type-input").select2({
        placeholder: "The type of the shop",
        theme: "bootstrap4",
        width: "100%",
        minimumResultsForSearch: 1 / 0
});

$("#shop-city-input").length && $("#shop-city-input").select2({
        placeholder: "City",
        theme: "bootstrap4",
        width: "100%",
        minimumResultsForSearch: 1 / 0
});
var $image = $('#upload-image'),
            cropBoxData,
            canvasData;
$(function(){
    
    FilePond.registerPlugin(
        FilePondPluginFileValidateSize,
        FilePondPluginFileValidateType
    );
    var $uploadCrop;
    
    let newImage;
    var isLogo = false;
    var isPhoto = false;
    $('#cropImageBtn').on('click', function(ev) {
        const contentType = 'image/jpeg';
        var base64 = $image.cropper('getCroppedCanvas', { 
              fillColor: '#fff' 
        }).toDataURL("image/jpeg");
        $('#cropImagePop').modal('hide');

        if(isLogo){
            $('#preview-logo').attr('image','submited');
            $('#preview-logo').attr('src',base64);
            pond.removeFile()   
        }else if(isPhoto){
            var imgpackage = document.createElement("div")
            imgpackage.classList.add("image-package")
            
            var img = document.createElement("img")
            img.classList.add("preview-sqr")
            img.src = base64;
            img.setAttribute("image","submited")
            imgpackage.appendChild(img)
            
            var button = document.createElement("button")
            button.classList.add("img-delete")
            button.setAttribute("type","button")
            button.innerHTML = '<i class="fas fa-times"></i>'
            imgpackage.appendChild(button)
            button.addEventListener('click', function() { $(this).parent().remove(); }, false);
            
            document.getElementById('preview-photo-section').appendChild(imgpackage)
            pond2.removeFile()   
        }else{
            $('#preview-thumbnail').attr('image','submited');
            $('#preview-thumbnail').attr('src',base64);
            pond3.removeFile()  
        }
    });

    const inputElement = document.getElementById('logo');
    const inputElement2 = document.getElementById('photo');
    const inputElement3 = document.getElementById('thumbnail');

    const pond = FilePond.create(inputElement, {
        allowReplace: true,
        allowRevert: false,
        instantUpload: false,
        maxFileSize: '5MB',
        acceptedFileTypes: ['image/png', 'image/jpeg']
    });

    const pond2 = FilePond.create(inputElement2, {
        allowReplace: true,
        allowRevert: false,
        instantUpload: false,
        maxFileSize: '5MB',
        acceptedFileTypes: ['image/png', 'image/jpeg']
    });

    const pond3 = FilePond.create(inputElement3, {
        allowReplace: true,
        allowRevert: false,
        instantUpload: false,
        maxFileSize: '5MB',
        acceptedFileTypes: ['image/png', 'image/jpeg']
    });

    document.querySelectorAll('.upload').forEach(item => {
        item.addEventListener('FilePond:addfile', e => {
            isLogo = false;
            isPhoto = false;
            if(e.srcElement.id === 'logo'){
                isLogo = true;
            }else if(e.srcElement.id === 'photo'){
                isPhoto = true;
                if($("#preview-photo-section").children().length == 4){
                    popUpMessage("You can't post more than 4 images", "danger");
                    pond2.removeFile()
                    return;
                }
            }
            if (e.detail && e.detail.error === null) {
                if (e.detail.file && e.detail.file.file.name) {
                    crop(e.detail.file.file)//, e.srcElement.id)
                }
            }
        })
    });
    
    function dataURLtoFile(dataurl, filename) {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }
    $("#cropImagePop").modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#cropImagePop').on('shown.bs.modal', function () {
        if(isPhoto || isLogo){
            $image.cropper({
                dragMode: 'move',
                aspectRatio: 1,
                cropBoxResizable: false,
                viewMode: 1
            });
        }else{
            $image.cropper({
                dragMode: 'move',
                aspectRatio: 1440/550,
                cropBoxResizable: false,
                viewMode: 1,
                autoCropArea: 1
            });
        }
    }).on('hidden.bs.modal', function () {
      cropBoxData = $image.cropper('getCropBoxData');
      canvasData = $image.cropper('getCanvasData');
      $image.cropper('destroy');
    });
    
    function crop(file){
        var fr = new FileReader();
        fr.onload = function () {
            $('#upload-image').attr("src",fr.result)
        }
        fr.readAsDataURL(file);
        $('#cropImagePop').modal('show'); 
    }

    
    $('#cancelCropBtn').on('click', function(ev) {
        pond.removeFile()
        pond2.removeFile()
        pond3.removeFile()
        $('#cropImagePop').modal('hide'); 
    })

});

var checkboxes = document.getElementsByClassName("check-hours");
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", function() {
        let day = this.id.split("-")[1]
        document.getElementById("time-" + day).disabled = !this.checked
    })
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
                $('#shop-type-input').val(response.stype_id);
                $('#shop-type-input').trigger('change');
                //type.value = response.stype_id;
                //city.value = response.city_id;
                $('#shop-city-input').val(response.city_id);
                $('#shop-city-input').trigger('change');
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

var submitImages = document.getElementById("photo-btn");
submitImages.addEventListener("click", function() {
    // var logo = document.getElementById("preview-logo-image");
    // var thumbnail = document.getElementById("preview-thumbnail-image");
    // var images = document.getElementById("preview-photo-image");
    var formData = new FormData();
    var upload = false;

    if($('#preview-logo').attr('image') === "submited"){
        upload = true;
        formData.append("logo",$("#preview-logo").attr('src'));
    }

    if($('#preview-thumbnail').attr('image') === "submited"){
        upload = true;
        formData.append("thumbnail",$("#preview-thumbnail").attr('src'));
    }

    var images = $('#preview-photo-section').find('img').map(function(){
        if($(this).attr('image') === "submited"){
            return $(this).attr('src')
        }
    }).get()

    for (var i = 0; i < images.length; i ++) {
        upload = true;
        var src = images[i];
        formData.append("photo[]",src);
    }
    if(upload == false){
        popUpMessage("No new image uploads", "danger");
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
})

var submitHours = document.getElementById("hours-btn");
submitHours.addEventListener("click", function() {
    var days = ["Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday"];
    var calls = ["time-monday", "time-tuesday", "time-wednesday", "time-thursday", "time-friday", "time-saturday", "time-sunday"];
    var checkcalls = ["check-monday", "check-tuesday", "check-wednesday", "check-thursday", "check-friday", "check-saturday", "check-sunday"];
    var hourData = [];
    var pattern = /[0-9]{2}:[0-9]{2}\s*-\s*[0-9]{2}:[0-9]{2}(,\s*[0-9]{2}:[0-9]{2}\s*-\s*[0-9]{2}:[0-9]{2})*/;
    for (var i = 0; i < 7; i++) {

        var day = document.getElementById(calls[i]);
        if (day.value) {
            if (pattern.test(day.value)) {
                console.log("here2")
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
                console.log("here12")
                popUpMessage(days[i] + ' ' + "has not valid pattern", "danger");
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
            }else{
                popUpMessage(response["message"], "success");
            }

        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.withCredentials = true;
    xhr.open('PUT', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
})

var submitDetails = document.getElementById("details-btn");
submitDetails.addEventListener("click", function() {
    var name = document.getElementById('shop-name-input');
    var type = $("#shop-type-input").val();
    var city = $("#shop-city-input").val();
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
        "stype": type,
        "email": email.value,
        "pnum": tel.value,
        "city": city,
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
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }
    xhr.withCredentials = true;
    xhr.open('PUT', api);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
})
