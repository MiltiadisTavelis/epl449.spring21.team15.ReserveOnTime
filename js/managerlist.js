$(document).ready(function(){
    $.ajax({
        url:'include/managerlist.php',
        type:'post',
        success:function(data){
            if(data != '0'){
                $('#reservations').html(data);
            }
        }
    });
});