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

	if(isset($data->start_time)){
		if(preg_match("/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/", $data->start_time)){
			$event->start_time = $data->start_time;
		}
		else{
			$msg['status'] = 'Wrong time format!';
			echo json_encode($msg);
			exit();
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
		else{
			$msg['status'] = 'Wrong time format!';
			echo json_encode($msg);
			exit();
		}
	}else{
		$msg['status'] = 'Please set the time!';
		echo json_encode($msg);
		exit();
	}	

	if(isset($data->start_date)){
		$date1 = $data->start_date;
		$date1 = str_replace(' ', '-', $date1);
			list($day, $month, $year) = explode('-', $date1);
			$day = substr($day,0,strlen($day)-2);
				$event->start_date = date('Y-m-d', strtotime($date1));
	}else{
		$msg['status'] = 'Please set the start date!';
		echo json_encode($msg);
		exit();
	}
	if(isset($data->stop_date)){
		$date2 = $data->stop_date;
		$date2 = str_replace(' ', '-', $date2);
			list($day, $month, $year) = explode('-', $date2);
			$day = substr($day,0,strlen($day)-2);
				$event->stop_date = date('Y-m-d', strtotime($date2));
	}else{
		$msg['status'] = 'Please set the end date!';
		echo json_encode($msg);
		exit();
	}

	if (strtotime($event->start_date) > strtotime($event->stop_date)){
		$msg['status'] = 'Your input is invalid. Conflict dates error has been detected';
		echo json_encode($msg);
		return;
	}

	if ($event->start_date == $event->stop_date) {
		if (strtotime($data->start_time) > strtotime($data->stop_time)) {
			$msg['status'] = 'Your input is invalid. Conflict hours error has been detected';
			echo json_encode($msg);
			return;
		}
	}

	$event->title = $data->title;
	$event->content = $data->content;
	$event->pic = $data->pic;
	$event->link = $data->link;
	$event->shop_id = $data->shop_id;

	if($event->create_event()){
		$msg['message'] = 'You have successfully created the event!';
		echo json_encode($msg);
	}
?>