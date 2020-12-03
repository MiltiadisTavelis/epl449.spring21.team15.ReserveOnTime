$(function () {
        $("#signupbtn").click(function () {
            var password = $("#pswrd1").val();
            var confirmPassword = $("#pswrd2").val();
            if (password != confirmPassword) {
                alert("Passwords do not match.");
                return false;
            }
            return true;
        });
    });