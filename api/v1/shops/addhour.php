<?php

	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	if(!isset($_SESSION['user_id'])){
		echo json_encode(array('message' => 'Not logged in'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/reservations.php';
	$database = new Connection();
	$db = $database->connect();
	$hours = new Shops($db);
	if($hours->shop_verify($_SESSION['user_id'],$data['shop_id'])){
		$days = array("Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday");
		$results = $hours->addhour($data);
		if($results == "1"){
			$msg['message'] = 'Successfully added hours';
			echo json_encode($msg);
		}else if($results == false){
			$msg['status'] = 'Server error';
			echo json_encode($msg);
		}else if($results[0] == "2"){
			$msg['status'] = $days[($results[1]-1)].' has overlap hour ranges.';
			echo json_encode($msg);
		}else if($results[0] == "3"){
			$msg['status'] = $days[($results[1]-1)].' has exceeded the maximoum day range. Max Range: 24 hours per day.';
			echo json_encode($msg);
		}else{
			$msg['status'] = $days[($results[1]-1)].' has 2 midnight hours. Please remove one.';
			echo json_encode($msg);
		}
	}else{
		$msg['status'] = 'Not authorized';
		echo json_encode($msg);
		return;
	}
?>