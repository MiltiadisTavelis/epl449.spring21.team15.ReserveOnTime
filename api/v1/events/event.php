<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';

	$database = new Connection();
	$db = $database->connect();
	$event = new Event($db);

	// if(!isset($_SESSION['user_id'])){
	// 	echo json_encode(array('message' => 'Not logged in'));
	// 	return;
	// };
	// if(($_SESSION['user_type']!='m')){
	// 	echo json_encode(array('message' => 'Not authorized'));
	// 	return;
	// };

	$event->id = $data['id'];
	$event->event();

	$timestamp = strtotime($event->start_date);
	$start_date = date("d/m/Y", $timestamp);
	$start_time = date("H:i", $timestamp);

	$timestamp2 = strtotime($event->stop_date);
	$stop_date = date("d/m/Y", $timestamp2);
	$stop_time = date("H:i", $timestamp2);
	
	$json = array(
		'id' => $event->id,
		'title' => $event->title,
		'content' => $event->content,
		'pic' => $event->pic,
		'link' => $event->link,
		'start_date' => $start_date,
		'stop_date' => $stop_date,
		'start_time' => $start_time,
		'stop_time' => $stop_time,
		'shop_id' => $event->shop_id
	);

	print_r(json_encode($json));
?>