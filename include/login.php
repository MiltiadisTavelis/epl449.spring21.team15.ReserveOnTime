<?php
    include("config.php");
    $db = new DBController();
	$con = $db->connect();

    session_start();

    $uemail = mysqli_real_escape_string($con,$_POST['email']);
    $password = mysqli_real_escape_string($con,$_POST['password']);

    $r1 = $con->query("SELECT usertype FROM USERS WHERE email='".$uemail."'");
    $r2 = $con->query("SELECT fname FROM USERS WHERE email='".$uemail."'");
    $r3 = $con->query("SELECT id FROM USERS WHERE email='".$uemail."'");
    $name = $r2->fetch_assoc()["fname"];
    $type = $r1->fetch_assoc()["usertype"];
    $id = $r3->fetch_assoc()["id"];
    $password = hash("sha256", $password);
    $sql_query = "SELECT count(*) AS cntUser FROM USERS WHERE email='".$uemail."' and password='".$password."'";
    $result = mysqli_query($con,$sql_query);
    $row = mysqli_fetch_array($result);
    $count = $row['cntUser'];
    
    if($count > 0){
        $_SESSION['id'] = $id;
        if($type == "m"){
            echo 2;
        }else{
            echo 1;
        }
        
    }else{
        echo 0;
    }

?>
