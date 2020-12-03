<?php
    include("config.php");
    $db = new DBController();
	$con = $db->connect();
    session_start();
    if(isset($_SESSION['id'])){
        $r1 = $con->query("SELECT fname FROM USERS WHERE id='".$_SESSION['id']."'");
        $name = $r1->fetch_assoc()["fname"];
        echo 'Welcome '.$name.'';
    }

?>