applyValidationRules()

window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();

            if (form.checkValidity() === true) {
                submit();
            }

            form.classList.add('was-validated');
        }, false);
    });
}, false);

function applyValidationRules() {
    if (document.getElementById('email-input') != null) {
        bootstrapValidate('#email-input', 'email:Please enter a valid e-mail address.|required:')
    }

    if (document.getElementById('shop-email-input') != null) {
        bootstrapValidate('#shop-email-input', 'email:Please enter a valid e-mail address.|required:')
    }

    if (document.getElementById('password-input') != null) {
        bootstrapValidate('#password-input', 'min:8:The password must be atleast 8 characters long.|required:')
    }

    if (document.getElementById('firstname-input') != null) {
        bootstrapValidate('#firstname-input', 'alpha:Please enter a valid name.|required:')
    }

    if (document.getElementById('lastname-input') != null) {
        bootstrapValidate('#lastname-input', 'alpha:Please enter a valid name.|required:')
    }

    if (document.getElementById('telcode-input') != null) {
        bootstrapValidate('#telcode-input', 'min:3:A valid code must be 3 digits.|integer:A telephone code cannot contain any alphabetical characters.|required:')
    }

    if (document.getElementById('tel-input') != null) {
        bootstrapValidate('#tel-input', 'min:8:A valid telephone number must be 8 digits.|integer:A telephone number cannot contain any alphabetical characters.|required:')
    }

    if (document.getElementById('passwordre-input') != null) {
        bootstrapValidate('#passwordre-input', 'matches:#password-input:Make sure the passwords match.|required:')
    }

    if (document.getElementById('shop-type-input') != null) {
        bootstrapValidate('#shop-type-input', 'alpha:Please enter a valid shop type.|required:')
    }

    if (document.getElementById('shop-province-input') != null) {
        bootstrapValidate('#shop-province-input', 'alpha:Please enter a valid province.|required:')
    }

    if (document.getElementById('people-input') != null) {
        bootstrapValidate('#people-input', 'integer:Please choose a valid amount of people.|required:')
    }
}