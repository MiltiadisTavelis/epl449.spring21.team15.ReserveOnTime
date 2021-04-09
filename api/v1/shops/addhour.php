<?php
	header('Access-Control-Allow-Methods: POST');
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
		if($hours->addhour($data)){
			$msg['message'] = 'Successfully added hours';
			echo json_encode($msg);
		}else{
			$msg['status'] = 'Server error';
			echo json_encode($msg);
		}
	}else{
		$msg['status'] = 'Not authorized';
		echo json_encode($msg);
		return;
	}
?>