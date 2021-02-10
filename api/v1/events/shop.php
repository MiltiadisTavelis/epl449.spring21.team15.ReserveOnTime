<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/events.php';

	$database = new Connection();
	$db = $database->connect();
	$event = new Event($db);

	$event->shop_id = $data['shop_id'];
	//model->function
	$event->shop_event();
	$results = $event->shop_event();

	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Events'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$rev = array(
				'title' => $title,
				'content' => $content,
				'pic' => $pic,
				'link' => $link,
				'start_date' => $start_date,
				'stop_date' => $stop_date,
			);
			array_push($json['Events'], $rev);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('NoEventsFound' => 'There are no Events on the Shop'));
	}
?>