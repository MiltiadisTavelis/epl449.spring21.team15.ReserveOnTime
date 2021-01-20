<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();

    $sname = $_POST["sname"];
    $stype = $_POST["stype"];
    $email = $_POST["email"];
    $name = $_POST["name"];
    $pnum = $_POST["pnum"];
	    
    $sql = "INSERT INTO PENDING_SHOPS( `sname`, `stype`, `email`, `name`, `pnum`) 
	VALUES ('$sname','$stype','$email','$name','$pnum')";
	if (mysqli_query($connect, $sql)) {
		echo json_encode(array("statusCode"=>200));
	} 
	else {
		echo json_encode(array("statusCode"=>201));
	}
	mysqli_close($connect);
	
	?>
        <script type="text/javascript">
            window.location = "../index";
        </script>
    <?php
	
?>
