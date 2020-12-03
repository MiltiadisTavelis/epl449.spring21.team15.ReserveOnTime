$(document).ready(function(){
    $.ajax({
        url:'include/myreservations.php',
        type:'post',
        success:function(data){
            if(data != '0'){
                $('#myreservations').html(data);
            }
        }
    });
});