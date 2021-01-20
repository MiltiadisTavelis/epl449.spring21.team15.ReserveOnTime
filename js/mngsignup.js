$(document).ready(function(){
    $('#submit').click(function(){
        var sname = $("#sname").val();
        var stype = $("#stype").val();
        var email = $("#email").val();
        var name = $("#name").val();
        var pnum = $("#pnum").val();
        $.ajax({
            url:'include/shops.php',
            type:'post',
            data:{sname:sname,stype:stype,email:email,name:name,pnum:pnum},
            success:function(response){
                var res = JSON.parse(response);
                var msg = "";
                if(res.statusCode == 200){
                    window.location = "index";
                }
            }
        });
    });
});