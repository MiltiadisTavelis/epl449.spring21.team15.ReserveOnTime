<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();
	
	$output = '';
	$sql = "SELECT * FROM SHOPS";
	$result = mysqli_query($connect,$sql);
    while($row = mysqli_fetch_array($result)){
        if($row["id"] == 1){
            $output .= '<li data-target="#carouselExampleIndicators" data-slide-to="'.(((int)$row["id"]) - 1).'" class="active"></li>'."\r\n";
        }else{
            $output .= '<li data-target="#carouselExampleIndicators" data-slide-to="'.(((int)$row["id"]) - 1).'"></li>'."\r\n";
        }
	}
	$output .= "||";
	$result = mysqli_query($connect,$sql);
	while($row = mysqli_fetch_array($result)){
	    if($row["id"] == 1){
	        $output .= '<div class="carousel-item active">
      			    <img class="d-block mw-100" src="img/'.$row["id"].'.jpg" alt="'.$row["id"].' slide">
      			    <div class="carousel-caption d-none d-md-block bg-dark mb-4" >
    				    <h5>'.$row["sname"].'</h5>
    				    <p>'.$row["description"].'</p>
  				    </div>
    		    </div>'."\r\n";
	    }else{
	        $output .= '<div class="carousel-item">
      			    <img class="d-block mw-100" src="img/'.$row["id"].'.jpg" alt="'.$row["id"].' slide">
      			    <div class="carousel-caption d-none d-md-block bg-dark mb-4" >
    				    <h5>'.$row["sname"].'</h5>
    				    <p>'.$row["description"].'</p>
  				    </div>
    		    </div>'."\r\n";
	    }
	
	}
    echo $output;
    exit;
?>