<?php
    include("config.php");
    $db = new DBController();
	$connect = $db->connect();
	
	$output = '';
	$sql = "SELECT * FROM SHOPS";
	$result = mysqli_query($connect,$sql);
    while($row = mysqli_fetch_array($result)){
        $output .= '<div class="col-lg-4">
                        <figure class="rounded p-3 bg-white shadow-sm">
          	                <a href="'.$row["id"].'">
          		                <img src="img/'.$row["id"].'.jpg" alt="" class="w-100 card-img-top">
          	                </a>
                            <figcaption class="p-4 card-img-bottom">
                                <h2 class="h5 font-weight-bold mb-2 font-italic">'.$row["sname"].'</h2>
                                <p class="mb-0 text-small text-muted font-italic">'.$row["description"].'</p>
                            </figcaption>
                        </figure>
                    </div>'."\r\n";
	}
    echo $output;
    exit;
?>