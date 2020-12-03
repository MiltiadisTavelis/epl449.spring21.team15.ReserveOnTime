$(document).ready(function(){
    $("#loginbtn").click(function(){
        var email = $("#email").val();
        var password = $("#pswrd").val();

        if( email !== "" && password !== "" ){
            $.ajax({
                url:'include/login.php',
                type:'post',
                data:{email:email,password:password},
                success:function(response){
                    if(response == 1){
                        window.location = "index.html";
                    }else if(response == 2){
                        window.location = "manager.html";
                    }else{
                        $("#wrong").html('<div class="invalid-feedback d-block" id="validemail">Wrong password or username !</div>');
                    }
                }
            });
        }
    });
});