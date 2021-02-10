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

	$results = $shops->types();
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Types'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$type = array(
				'id' => $id,
				'type' => $type
			);
			array_push($json['Types'], $type);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('status' => 'No shop types found'));
	}
?>