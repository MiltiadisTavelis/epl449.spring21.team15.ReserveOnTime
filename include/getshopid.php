<?php
    include("config.php");
    $db = new DBController();
	$con = $db->connect();

    session_start();
    
    $id = $_POST["page"];
    $_SESSION['shopid'] = $id;
    echo $id;

?>