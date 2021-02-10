<?php
	header('Access-Control-Allow-Methods: PUT');
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	
	// include_once '../../config/config.php';
	// include_once '../../models/reviews.php';

	$database = new Connection();
	$db = $database->connect();
	$review = new Review($db);

	$data = json_decode(file_get_contents("php://input"));

	$review->id = $data->id;

	if($review->delete_review()){
		$msg['status'] = 'Successfully Deleted';
		echo json_encode($msg);
	}
?>