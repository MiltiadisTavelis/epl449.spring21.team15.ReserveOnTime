<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Methods: POST');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

	//include_once '../../config/config.php';
	//include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();
	$review = new Review($db);

	$data = json_decode(file_get_contents("php://input"));

	$review->shop_id = $data->shop_id;
	$review->uid = $data->uid;
	$review->content = $data->content;
	$review->rating = $data->rating;

	if($review->create_review()){
		$msg['status'] = 'Successfully Created';
		echo json_encode($msg);
	}
?>