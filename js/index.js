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
        "type": "shops/all"
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        } else {
            var message = document.createElement('div');
            message.setAttribute("class", "alert alert-danger text-center");
            message.setAttribute("role", "alert");
            message.textContent = "There was an unexpected error.";
            var container = document.getElementById("contents");
            container.appendChild(message);

            $(".alert-danger").delay(3000).fadeOut(function() {
                $(this).remove();
            });
        }
    }

    xhr.open('POST', 'http://api.reserveontime.com/actions');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}