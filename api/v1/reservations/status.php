<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/reservations.php';
	
	session_start();

	if(!isset($_SESSION['user_id'])){
		echo json_encode(array('message' => 'Not logged in'));
		return;
	};

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Methods: PUT');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

	$database = new Connection();
	$db = $database->connect();
	$rsrv = new Reservation($db);

	$data = json_decode(file_get_contents("php://input"));

	$rsrv->id = $data->id;
	
	if($data->status == "0" || $data->status == "1" || $data->status == "3"){
		$rsrv->status = $data->status;

		if($rsrv->status()){
			$msg['status'] = 'Successfully Updated';
			echo json_encode($msg);
		}else{
			$msg['status'] = 'Invalid command';
			echo json_encode($msg);
		}

	}else{
		$msg['status'] = 'Not valid value';
		echo json_encode($msg);
	}
?>