<?php
	header('Access-Control-Allow-Methods: POST');
	
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	if(!isset($_SESSION['user_id'])){
		echo json_encode(array('NotOnline' => 'Not logged in'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();
	$review = new Review($db);

	$data = json_decode(file_get_contents("php://input"));

	$review->shop_id = $data->shop_id;
	$review->uid = $_SESSION['user_id'];
	$review->content = $data->content;
	$review->rating = $data->rating;

	if (strlen($data->content) < 1) {
		$msg['status'] = ' Unable to create review. Your review does not contain a description';
		echo json_encode($msg);
		return;
	}

	if($review->create_review()){
		$msg['message'] = ' Review Successfully Created';
		echo json_encode($msg);
	}
?>