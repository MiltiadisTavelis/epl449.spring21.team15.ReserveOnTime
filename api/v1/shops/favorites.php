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
	$results = $shops->favorites();

	$json = array();
	if($results != false){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			array_push($json, $shop_id);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('status' => 'Server error, please try again!'));
	}
?>