<?php
    include("config.php");
    $db = new DBController();
	$conn = $db->connect();
    session_start();
    $num = $_GET['getid'];
    $getid = $_SESSION['num'.$num];
    if ($conn->connect_error) {
        echo '0';
    }
    $sql = "UPDATE RESERVATIONS SET status = '1' WHERE id = '$getid'";
    if ($conn->query($sql) === TRUE) {
        echo 'Accepted';
    }
?>