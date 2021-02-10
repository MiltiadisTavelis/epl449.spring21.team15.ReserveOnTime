<?php
	header('Access-Control-Allow-Methods: POST');
	
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	session_start();

	if(!isset($_SESSION['user_id'])){
		echo json_encode(array('message' => 'Not logged in'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/reservations.php';

	$database = new Connection();
	$db = $database->connect();
	$rsrv = new Reservation($db);

	$data = json_decode(file_get_contents("php://input"));

	$rsrv->day = $data->day;
	$rsrv->people = $data->people;
	$rsrv->shopid = $data->shop_id;
	$rsrv->userid = $_SESSION['user_id'];
	if($rsrv->create_rsrv()){
		$msg['status'] = 'Successfully Created';
		echo json_encode($msg);
	}
?>