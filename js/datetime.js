$(function () {
    // INITIALIZE DATEPICKER PLUGIN
    $('#reservationDate').datepicker({
        dateFormat: "dd/mm/yy",
        clearBtn: true
    });

    $('#reservationTime').timepicker({
        format: 'hh.mm',
        clearBtn: true
    });


    // FOR DEMO PURPOSE
    $('#reservationDate').on('change', function () {
        var pickedDate = $('input').val();
        $('#pickedDate').html(pickedDate);
    });

    $('#reservationTime').on('change', function () {
        var pickedDate = $(this).val();
        $('#pickedTime').html(pickedDate);
    });

    $('#people').on('change', function () {
        var pickedDate = $(this).val();
        $('#people_num').html(pickedDate);
    });
});

