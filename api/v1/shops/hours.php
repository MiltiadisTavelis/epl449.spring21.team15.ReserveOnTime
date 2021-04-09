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
	for ($i=0; $i < 7; $i++) { 
		$day[$i] = array();
		array_push($day[$i], array('active' => 0));
		array_push($json['Hours'], $day[$i]);
	}
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			if($active == "1"){
				$json['Hours'][$day-1][0]['active'] = $active;
			}
			$hours = array(
				'open' => date("H:i", strtotime($open)),
				'close' => date("H:i", strtotime($close)),
				'day' => $day,
				'split' => $split
			);
			array_push($json['Hours'][$day-1], $hours);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('status' => 'No hours found for this shop'));
	}
?>