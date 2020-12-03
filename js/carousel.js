$(document).ready(function(){
    $.ajax({
        url:"include/carousel.php",
            method: "POST",
            success:function(data){
                $('#addcarousel').html(data.split("||")[0]);
                $('#addcarouselrest').html(data.split("||")[1]);
            }
    });

});