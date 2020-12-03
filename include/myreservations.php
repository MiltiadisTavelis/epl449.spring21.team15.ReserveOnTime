<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();
           
    session_start();

    if($connect->connect_error){
        echo '0';
    }else{
        $output = '';
	    $sql = "SELECT * FROM RESERVATIONS WHERE userid = '".$_SESSION['id']."'";
	    $result = mysqli_query($connect,$sql);
	    $i = 1;
	    if(mysqli_num_rows($result)>0){
    
            while($row = mysqli_fetch_array($result)){
                $r1 = "SELECT sname FROM SHOPS WHERE id ='".$row["shopid"]."'";
                $shopname = mysqli_query($connect,$r1);
                $r = mysqli_fetch_row($shopname);
                $stat = '';
                if($row["status"] == '0'){
                    $stat = 'Pending';
                }else if($row["status"] == '1'){
                    $stat = 'Accepted';
                }else{
                    $stat = 'Declined';
                }
                $output .= '<tr>
                            <td>'.$i++.'</td>
                            <td>'.$row["fname"].'</td>
                            <td>'.$row["lname"].'</td>
                            <td>'.$row["day"].'</td>
                            <td>'.$row["time"].'</td>
                            <td>'.$row["people"].'</td>
                            <td>'.$row["pnum"].'</td>
                            <td>'.$r[0].'</td>
                            <td>'.$stat.'</td>
                        </tr>'."\r\n";
            }
            echo $output;
	    }
    }
    
?>