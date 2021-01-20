$(document).ready(function(){
    $('#search').keyup(function(){
        var txt = $(this).val();
        if(txt!=''){
            $.ajax({
                url:"include/search.php",
                method:"POST",
                data:{search:txt},
                success:function(data){
                    $('#results').html(data);
                }
            });
        }
    });
});
