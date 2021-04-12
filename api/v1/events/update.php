<?php
	header('Access-Control-Allow-Methods: PUT');

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

	// include_once '../../config/config.php';
	// include_once '../../models/events.php';

	$database = new Connection();
	$db = $database->connect();

	$event = new Event($db);
	$event->id = $data['id'];

	$data = json_decode(file_get_contents("php://input"));

	if (strtotime($data->start_date) > strtotime($data->stop_date)){
		$msg['status'] = 'Conflict dates!';
		echo json_encode($msg);
		return;
	}
	else if ($data->start_date == $data->stop_date) {
		if (strtotime($data->start_time) > strtotime($data->stop_time)) {
			$msg['status'] = 'Conflict hours!';
			echo json_encode($msg);
			return;
		}
	}

	if(isset($data->start_time)){
		if(preg_match("/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/", $data->start_time)){
			$event->start_time = $data->start_time;
		}
	}else{
		$msg['status'] = 'Please set the time!';
		echo json_encode($msg);
		exit();
	}
	if(isset($data->stop_time)){
		if(preg_match("/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/", $data->stop_time)){
			$event->stop_time = $data->stop_time;
		}
	}else{
		$msg['status'] = 'Please set the time!';
		echo json_encode($msg);
		exit();
	}	

	if(isset($data->start_date)){
		$date1 = $data->start_date;
		$date1 = str_replace('/', '-', $data->start_date);
		if(false !== strtotime($date1)){
			list($day, $month, $year) = explode('-', $date1); 
			if(checkdate($month, $day, $year)){
				$event->start_date = str_replace('/', '-', $data->start_date);
			}
		}
	}else{
		$msg['status'] = 'Please set the date!';
		echo json_encode($msg);
		exit();
	}
	if(isset($data->stop_date)){
		$date2 = $data->stop_date;
		$date2 = str_replace('/', '-', $data->stop_date);
		if(false !== strtotime($date2)){
			list($day, $month, $year) = explode('-', $date2); 
			if(checkdate($month, $day, $year)){
				$event->stop_date = str_replace('/', '-', $data->stop_date);
			}
		}
	}else{
		$msg['status'] = 'Please set the date!';
		echo json_encode($msg);
		exit();
	}


	$event->title = $data->title;
	$event->content = $data->content;
	$event->pic = $data->pic;
	$event->link = $data->link;

	if($event->update_event()){
		$msg['message'] = 'Successfully Updated';
		echo json_encode($msg);
	}
	else{
		$msg['status'] = 'Not Updated';
		echo json_encode($msg);
	}
?>