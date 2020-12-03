$(document).ready(function(){
    var path = window.location.pathname;
    var page = path.split("/").pop();
    page = page.split(".")[0];
        $.ajax({
            url:'include/getshopid.php',
            type:'post',
            data:{page:page}
        });
});