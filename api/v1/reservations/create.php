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

	if(isset($data->time) && preg_match("/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/", $data->time)){
		$rsrv->res_time = $data->time;
	}	

	if(isset($data->day)){
		$date = $data->day;
		$date = str_replace('/', '-', $data->day);
		if(false !== strtotime($date)){
			list($day, $month, $year) = explode('-', $date); 
			if(checkdate($month, $day, $year)){
				$rsrv->day = str_replace('/', '-', $data->day);
			}
		}
	}

	$rsrv->people = $data->people;
	$rsrv->shopid = $data->shop_id;
	$rsrv->userid = $_SESSION['user_id'];
	$result = $rsrv->create_rsrv();
	if($result == "1"){
		$msg['message'] = 'Successfully Created';
		echo json_encode($msg);
	}elseif($result == "2"){
		$msg['status'] = "You can't make a reservation if the shop is closed!";
		echo json_encode($msg);
	}elseif($result == "3"){
		$msg['status'] = 'Server Error';
		echo json_encode($msg);
	}elseif($result == "4"){
		$msg['NotAvailable'] = 'The shop is full';
		echo json_encode($msg);
	}
?>