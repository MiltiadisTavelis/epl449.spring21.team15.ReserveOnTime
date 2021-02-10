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
            var response = JSON.parse(xhr.responseText);
            var shops = response["Shops"];
            for (entry in shops) {
                console.log('Name: ' + shops[entry].sname);
                console.log('Type: ' + shops[entry].stype);
                console.log('Area: ' + shops[entry].area);
                console.log('Tel: ' + shops[entry].pnum);
                console.log('\n\n');
            }
        } else {
            popUpMessage("There was an unexpected error", "danger");
        }
    }

    xhr.open('POST', 'http://api.reserveontime.com/action');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}