<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();
           
    session_start();

    if($connect->connect_error){
        echo '0';
    }else{
        $output = '';
        
        $sql = "SELECT id FROM SHOPS WHERE mngid ='".$_SESSION['id']."'";
        $r = mysqli_query($connect,$sql);
        $r = mysqli_fetch_row($r);
        $shopid = $r[0];
                
	    $sql = "SELECT * FROM RESERVATIONS WHERE shopid = '".$shopid."'";
	    $result = mysqli_query($connect,$sql);
	    $i = 0;
	    if(mysqli_num_rows($result)>0){
    
            while($row = mysqli_fetch_array($result)){
                $stat = '';
                $i++;
                if($row["status"] == '0'){
                    $stat = '<td id="stat'.$i.'"><button class="accept" id ="accept" onclick="accept('.$i.')"><i class="fa fa-check" aria-hidden="true"></i></button>
                                <button class="reject" id ="reject" onclick="reject('.$i.')"><i class="fa fa-ban" aria-hidden="true"></i></button></td>';
                }else if($row["status"] == '1'){
                    $stat = '<td id="stat">Accepted</td>';
                }else{
                    $stat = '<td id="stat">Declined</td>';
                }
                $_SESSION['num'.$i] = $row["id"];
                $output .= '<tr>
                            <td>'.$i.'</td>
                            <td>'.$row["fname"].'</td>
                            <td>'.$row["lname"].'</td>
                            <td>'.$row["day"].'</td>
                            <td>'.$row["time"].'</td>
                            <td>'.$row["people"].'</td>
                            <td>'.$row["pnum"].'</td>
                            '.$stat.'
                        </tr>'."\r\n";
            }
            echo $output;
	    }
    }
    
?>