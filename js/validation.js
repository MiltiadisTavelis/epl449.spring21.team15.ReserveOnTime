var form = document.querySelector('.needs-validation');

form.addEventListener('submit', function(event) {
    requiredFields = form.querySelectorAll('[required]')

    for (i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i].value === '') {
            requiredFields[i].classList.add('is-invalid')
        }
    }

    if (form.getElementsByClassName('is-invalid').length != 0) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
})