 $( document ).ready(function() {
    $("#logoutbtn").click(function() {
            $.ajax({
                url: 'include/logout.php',
                success: function(){
                    window.location = '../index';
                }
            });
        });
});