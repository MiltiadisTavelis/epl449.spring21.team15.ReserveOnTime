<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();
            
    $fname = $_POST["fname"];
    $lname = $_POST["lname"];
    $year = $_POST["year"];
    $month = $_POST["month"];
    $day = $_POST["day"];
    $gender = $_POST["gender"];
    $phone_code = $_POST["phone_code"];
    $pnum = $_POST["pnum"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $usertype = 'u';

    if($connect->connect_error){
        die("Connect Error :" .$connect->connect_error);
    }else{

        $stmt= $connect->prepare("INSERT INTO USERS(fname,lname,year,month,day,gender,phone_code,pnum,email,password,usertype) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("ssiiississs",$fname,$lname,$year,$month,$day,$gender,$phone_code,$pnum,$email,$password,$usertype);
        $stmt->execute();
        $stmt->close();
        $connect->close();
        
        ?>
        <script type="text/javascript">
            window.location = "../index.html";
        </script>      
        <?php
    }
?>