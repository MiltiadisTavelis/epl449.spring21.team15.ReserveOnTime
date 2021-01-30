<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	//include_once '../../config/config.php';
	//include_once '../../models/reviews.php';

	$database = new Connection();
	$db = $database->connect();
	$review = new Review($db);

	$review->shop_id = isset($_GET['id']) ? $_GET['id'] : die();
	//model->function
	$review->shop_reviews();
	$results = $review->shop_reviews();

	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Reviews'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$rev = array(
				'fname' => $fname,
				'lname' => $lname,
				'content' => $content,
				'rating' => $rating,
				'sub_date' => $sub_date
			);
			array_push($json['Reviews'], $rev);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('NoReviewsFound' => 'There are no Reviews on the Shop'));
	}
?>