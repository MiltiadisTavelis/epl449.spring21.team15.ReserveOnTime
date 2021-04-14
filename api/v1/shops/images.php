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
	$shops->image_type = $data['image_type'];
	$results = $shops->images();
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Images'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$type = array(
				'image_url' => $image_url
			);
			array_push($json['Images'], $type);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('status' => 'No images found'));
	}
?>