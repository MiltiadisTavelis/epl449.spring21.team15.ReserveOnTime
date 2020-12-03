    function accept(id){
        var getid = id;
        var el = "#stat"+id;
        $.ajax({
            url:'include/accept.php',
            type:'get',
            data:{getid:getid},
            success:function(data){
                console.log(getid);
                if(data !== 0){
                    console.log('"' + data + '"');
                   $(el).html(data);
                }
            }
        });
    }
    
    function reject(id){
        var getid = id;
        var el = "#stat"+id;
        console.log(el);
        $.ajax({
            url:'include/reject.php',
            type:'get',
            data:{getid:getid},
            success:function(data){
                if(data !== 0){
                    console.log('"' + data + '"');
                   $(el).html(data);
                }
            }
        });
    }