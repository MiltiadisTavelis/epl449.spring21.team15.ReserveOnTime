$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    startDate: "today",
    todayHighlight: true
});

$('.clockpicker').clockpicker({
    default: 'now',
    autoclose: true,
    donetext: ''
});

let currentDate = new Date()
let cDay = currentDate.getDate()
let cMonth = currentDate.getMonth() + 1
let cYear = currentDate.getFullYear()
document.getElementById("dateInput").value = cDay + '/' + cMonth + '/' + cYear