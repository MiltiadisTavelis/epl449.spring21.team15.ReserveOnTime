$(document).ready(function(){
    $.ajax({
        url:'include/getname.php',
        type:'post',
        success:function(response){
            $("#change").html(response);
        }
    });
});