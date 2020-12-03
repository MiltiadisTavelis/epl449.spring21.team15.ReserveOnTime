
    function check(){
        $.ajax({
            url:'include/checkforupdate.php',
            success:function(response){
                if(response != 0){
                    $("#loading").html(response);
                }
            }
        });
    }
    check();
    setInterval(check, 2000);
