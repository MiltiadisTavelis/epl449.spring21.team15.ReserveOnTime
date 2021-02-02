bootstrapValidate(['#firstname-input', '#lastname-input'], 'alpha:Please enter a valid name.')
bootstrapValidate('#telcode-input', 'min:3:A valid code must be 3 digits.|integer:A telephone code cannot contain any alphabetical characters.')
bootstrapValidate('#tel-input', 'min:8:A valid telephone number must be 8 digits.|integer:A telephone number cannot contain any alphabetical characters.')
bootstrapValidate('#email-input', 'email:Please enter a valid e-mail address.')
bootstrapValidate('#password-input', 'min:8:The password must be atleast 8 characters long.')
bootstrapValidate('#passwordre-input', 'matches:#password-input:Make sure the passwords match.')

$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1,
    todayHighlight: true
});