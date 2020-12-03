<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();
           
    session_start();
    $id = $_SESSION['id'];
    $sql = "SELECT fname,lname,pnum FROM USERS WHERE id = '".$id."'";
    $result = mysqli_query($connect,$sql);
    $row = mysqli_fetch_array($result);
    $fname = $row["fname"];
    $lname = $row["lname"];
    $pnum = $row["pnum"];
    $day = $_POST['day'];
    
    $time = $_POST["time"];
    $people = $_POST["people"];
    $shopid = $_SESSION['shopid'];
    $userid = $_SESSION['id'];

    if($connect->connect_error){
        echo '0';
    }else{
        $stmt= $connect->prepare("INSERT INTO RESERVATIONS(fname,lname,day,time,people,pnum,shopid,userid) VALUES(?,?,?,?,?,?,?,?)");
        $stmt->bind_param("ssssisii",$fname,$lname,$day,$time,$people,$pnum,$shopid,$userid);
        $stmt->execute();
        $lastid = mysqli_insert_id($connect); 
        $_SESSION['lastid'] = $lastid;
        $stmt->close();
        $connect->close();
        echo '1';
    }
    
?>

