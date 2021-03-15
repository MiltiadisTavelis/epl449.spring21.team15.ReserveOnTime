<?php
	header('Access-Control-Allow-Methods: PUT');
	
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';

	if(count(get_included_files()) ==1) exit(json_encode(array('status' => 'Bad Request')));

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);

	$data = json_decode(file_get_contents("php://input"));

	if(isset($_SESSION['user_id'])){
		$user->id = $_SESSION['user_id'];
	}else{
		echo json_encode(array('status' => 'No online user found'));
		exit();
	}

	function validateDate($date, $format = 'Y-m-d H:i:s')
	{
    	$d = DateTime::createFromFormat($format, $date);
    	return $d && $d->format($format) == $date;
	}

	if(isset($data->birth)){
		$date = $data->birth;
		$date = str_replace('/', '-', $date);
		if(false !== strtotime($date)){
			list($day, $month, $year) = explode('-', $date);
			if(validateDate($data->birth, 'd/m/Y')){
				$date = str_replace('/', '-', $data->birth);
				$user->birth = date('Y-m-d', strtotime($date));
			}
		}
	}

	$user->gender = $data->gender;
	$user->fname = $data->fname;
	$user->lname = $data->lname;
	$user->phone_code = $data->phone_code;
	$user->pnum = $data->pnum;
	
	if($user->update_user()){
		$msg['status'] = 'Successfully Updated';
		echo json_encode($msg);
	}
?>