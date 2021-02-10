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
	if(($_SESSION['user_type']!='m')){
		echo json_encode(array('message' => 'Not authorized'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/events.php';

	$database = new Connection();
	$db = $database->connect();
	$event = new Event($db);

	$data = json_decode(file_get_contents("php://input"));

	$event->title = $data->title;
	$event->content = $data->content;
	$event->pic = $data->pic;
	$event->link = $data->link;
	$event->start_date = $data->start_date;
	$event->stop_date = $data->stop_date;
	$event->shop_id = $data->shop_id;

	if($event->create_event()){
		$msg['status'] = 'Successfully Created';
		echo json_encode($msg);
	}
?>