$(document).ready(function(){
    $.ajax({
        url:'include/getmng.php',
        type:'post',
        cache: false,
        success:function(response){
            $("#welcome").html(response);
        }
    });
});