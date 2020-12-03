$( document ).ready(function() {
    $('#email').blur(function() {
        var email = $(this).val();
			// sending ajax request
			$.ajax({
				url: 'include/validemail.php',   // sending ajax request to this url
				method: "POST",
				data: {user_email:email},
				success:function(data) {
				if(data == 1){
				    $("#validemail").html('<div class="invalid-feedback d-block" id="validemail">Email not Available!</div>');
				    $("#signupbtn").attr("disabled",true);
	            }else{
	                $("#validemail").html('<div class="valid-feedback d-block" id="validemail">Looks good!</div>');
	                $("#signupbtn").attr("disabled",false);
	            }
			}
		});
    });
});