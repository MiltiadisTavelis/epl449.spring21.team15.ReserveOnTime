$(document).ready(function(){
    $('#reservebtn').click(function(){
        var day = $("#reservationDate").val();
        var time = $('#reservationTime').val();
        var people = $("#people").val();
        $.ajax({
            url:'include/reservations.php',
            type:'post',
            data:{day:day,time:time,people:people},
            success:function(data){
                if(data == 1){ 
                    window.location = "thankyou";
                }
            }
        });
    });
});