<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	if(!isset($_SESSION['user_id'])){
		echo json_encode(array('message' => 'Not logged in'));
		return;
	};

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Methods: POST');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

	//include_once '../../config/config.php';
	//include_once '../../models/reservations.php';
	$database = new Connection();
	$db = $database->connect();
	$hours = new Shops($db);
	if($hours->shop_verify($_SESSION['user_id'],$data['shop_id'])){
		if($hours->addhour($data)){
			$msg['status'] = 'Successfully added';
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