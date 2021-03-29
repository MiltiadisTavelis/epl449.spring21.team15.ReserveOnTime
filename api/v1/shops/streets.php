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
	$shops->city = $data['city'];
	$shops->postcode = $data['postcode'];
	$shops->area = $data['area'];

	$results = $shops->streets();
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Streets'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$type = array(
				'street' => $street
			);
			array_push($json['Streets'], $type);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('status' => 'No streets found'));
	}
?>