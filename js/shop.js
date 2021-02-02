bootstrapValidate('#people-input', 'integer:Please choose a valid amount of people.')

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    todayHighlight: true
});

$('.clockpicker').clockpicker({
    default: 'now',
    autoclose: true,
    donetext: ''
});