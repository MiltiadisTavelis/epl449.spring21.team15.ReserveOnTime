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

	$results = $shops->showhours($data['shop_id']);
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Hours'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$shop = array(
				'open' => $open,
				'close' => $close,
				'day' => $day
			);
			array_push($json['Hours'], $shop);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('status' => 'No hours found for this shop'));
	}
?>