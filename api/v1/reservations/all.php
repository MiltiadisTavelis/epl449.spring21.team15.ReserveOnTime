<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	session_start();

	if(!isset($_SESSION['user_id'])){
		echo json_encode(array('message' => 'Not logged in'));
		return;
	};

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	//include_once '../../config/config.php';
	//include_once '../../models/reservations.php';

	$database = new Connection();
	$db = $database->connect();

	$rsrv = new Reservation($db);

	if(isset($data['shop_id']) && $_SESSION['page_type'] == "m"){
		$rsrv->shopid = $data['shop_id'];
	}elseif(isset($data['shop_id']) && $_SESSION['page_type'] != "m"){
		$msg['status'] = 'Not authorized';
		echo json_encode($msg);
		return;
	}

	if(isset($data['status']) && ($data['status'] == "0" || $data['status'] == "1" || $data['status'] == "2" || $data['status'] == "3")){
		$rsrv->status = $data['status'];
	}

	if(isset($data['sort'])){
		$rsrv->sort = $data['sort'];
	}

	if(isset($data['today'])){
		$rsrv->today = $data['today'];
	}
	if(isset($data['lname']) && $_SESSION['page_type'] == "m"){
		$rsrv->lname = $data['lname'];
	}elseif(isset($data['lname']) && $_SESSION['page_type'] != "m"){
		$msg['status'] = 'Not authorized';
		echo json_encode($msg);
		return;
	}

	if(isset($data['phone']) && $_SESSION['page_type'] == "m"){
		$rsrv->phone = $data['phone'];
	}elseif(isset($data['phone']) && $_SESSION['page_type'] != "m"){
		$msg['status'] = 'Not authorized';
		echo json_encode($msg);
		return;
	}

	if(isset($data['shop']) && $_SESSION['page_type'] == "u"){
		$rsrv->shop = $data['shop'];
	}elseif(isset($data['shop']) && $_SESSION['page_type'] != "u"){
		$msg['status'] = 'Not authorized';
		echo json_encode($msg);
		return;
	}

	$results = $rsrv->reservations();
	if($results == "-1"){
		$msg['status'] = 'Please select your shop to see your reservations';
		echo json_encode($msg);
	}
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Reservations'] = array();

	if($cnt > 0 ){
		if($_SESSION['page_type'] == "u"){
			while($row = mysqli_fetch_array($results)){
				extract($row);
				$datetime = new DateTime($day);
				$date = $datetime->format('Y-m-d');
				$time = $datetime->format('H:i:s');
				$rsrv = array(
					'id' => $id,
					'sname' => $sname,
					'day' => $date,
					'time' => $time,
					'people' => $people,
					'status' => $status
				);
				array_push($json['Reservations'], $rsrv);
			}
			echo json_encode($json);
		}elseif($_SESSION['page_type'] == "m"){
			while($row = mysqli_fetch_array($results)){
				extract($row);
				$datetime = new DateTime($day);
				$date = $datetime->format('Y-m-d');
				$time = $datetime->format('H:i:s');
				$rsrv = array(
					'id' => $id,
					'fname' => $fname,
					'lname' => $lname,
					'pnum' => $pnum,
					'day' => $date,
					'time' => $time,
					'people' => $people,
					'status' => $status
				);
				array_push($json['Reservations'], $rsrv);
			}
			echo json_encode($json);
		}else{
			$msg['status'] = 'Not authorized';
			echo json_encode($msg);
		}
	}else{
		echo json_encode(array('NoRsrvFound' => 'There are no Reservations on the Server'));
	}
?>