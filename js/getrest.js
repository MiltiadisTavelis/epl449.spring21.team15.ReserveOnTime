$(document).ready(function(){
    $.ajax({
        url:"include/getrest.php",
            method: "POST",
            success:function(data){
                $('#results').html(data);
            }
    });

});