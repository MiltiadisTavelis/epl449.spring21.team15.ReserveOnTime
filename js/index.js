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

function submit() {
    event.preventDefault();
    event.stopPropagation();

    var xhr = new XMLHttpRequest();
    var data = {
        type: "shops/all"
    };

    xhr.onload = function() {
        if (xhr.status != 200) {
            var message = document.createElement('div');
            message.setAttribute("class", "alert alert-danger text-center");
            message.setAttribute("role", "alert");
            message.textContent = xhr.responseText;
            var container = document.getElementById("contents1");
            container.appendChild(message);

            $(".alert-danger").delay(4000)
                .fadeOut(function() {
                    $(this).remove();
                });
        } else {
            console.log(xhr.responseText);
        }
    }

    xhr.open("GET", "http://api.reserveontime.com/action");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}