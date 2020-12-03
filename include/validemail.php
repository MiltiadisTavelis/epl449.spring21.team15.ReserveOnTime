<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();

	if(isset($_POST["user_email"])){
	    $uemail = mysqli_real_escape_string($connect,$_POST["user_email"]);
	    $sql = "SELECT * FROM USERS WHERE email = '".$uemail."'";
	    $result = mysqli_query($connect,$sql);
	    echo mysqli_num_rows($result);
	}
?>