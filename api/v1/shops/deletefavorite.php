<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();

	$shops = new Shops($db);

	$shops->id = $data['shop_id'];
	$results = $shops->deletefavorite();

	if($results == true){
		echo json_encode(array('message' => 'Successfully deleted'));
	}else{
		echo json_encode(array('status' => 'Server error, please try again!'));
	}
?>