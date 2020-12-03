<?php
    include("config.php");
    $db = new DBController();
	$con = $db->connect();
    session_start();
    if(isset($_SESSION['id'])){
        $r1 = $con->query("SELECT fname FROM USERS WHERE id='".$_SESSION['id']."'");
        $name = $r1->fetch_assoc()["fname"];
        echo '<li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">'.$name.' <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li><a href="logout.php" id="logoutbtn">Logout</a></li>
          <li><a href="reservationlist.html">Reservations</a></li>
        </ul>
        </li>';
    }else{
     echo '<li class="nav-item">
                <a class="nav-link" href="login.html">Log In</a>
            </li>';    
    }

?>