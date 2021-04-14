<?php
	header('Access-Control-Allow-Methods: PUT');

	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/reservations.php';

	if(!isset($_SESSION['user_id'])){
		echo json_encode(array('message' => 'Not logged in'));
		return;
	};

	$database = new Connection();
	$db = $database->connect();
	$rsrv = new Reservation($db);

	$data = json_decode(file_get_contents("php://input"));

	$rsrv->id = $data->id;
	$rsrv->status = $data->status;
	if($data->status == "0" || $data->status == "1" || $data->status == "3"){
		$results = $rsrv->status();
		$results = mysqli_fetch_array($results);
		if($rsrv->status() != false){
			$msg['status'] = 'Successfully Updated';
			echo json_encode($msg);
			if($data->status != "3"){
				require_once($_SERVER['DOCUMENT_ROOT']."/api/v1/users/notifystatus.php");
			}
		}else{
			$msg['status'] = 'Invalid command';
			echo json_encode($msg);
		}

	}else{
		$msg['status'] = 'Not valid value';
		echo json_encode($msg);
	}
?>
