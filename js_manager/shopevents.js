checkSession("m", true)

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    maxViewMode: 2,
    weekStart: 1,
    startDate: "today",
    todayBtn: "linked",
    todayHighlight: true
});