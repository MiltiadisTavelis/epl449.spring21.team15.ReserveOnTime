$( document ).ready(function() {
    $.ajax({
    		url: 'include/islogin.php', 
    		method: "POST",
    		success:function(data) {
    			if(data == 1){
    			    $('#reservebtn').attr("href", "reservation");
    	        }else if(data == 0){
    	            $('#reservebtn').attr("href", "login");
    	        }
		    }
	});
});