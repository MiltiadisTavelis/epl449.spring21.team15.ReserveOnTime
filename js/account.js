bootstrapValidate(['#firstname-input', '#lastname-input'], 'alpha:Please enter a valid name.')
bootstrapValidate('#telcode-input', 'min:3:A valid code must be 3 digits.|integer:A telephone code cannot contain any alphabetical characters.')
bootstrapValidate('#tel-input', 'min:8:A valid telephone number must be 8 digits.|integer:A telephone number cannot contain any alphabetical characters.')
bootstrapValidate('#email-input', 'email:Please enter a valid e-mail address.')

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    endDate: "today",
    startView: 2
});