<?php
	header('Access-Control-Allow-Methods: POST');

	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);

	$data = json_decode(file_get_contents("php://input"));

	$user->fname = $data->fname;
	$user->lname = $data->lname;

	function validateDate($date, $format = 'Y-m-d H:i:s')
	{
    	$d = DateTime::createFromFormat($format, $date);
    	return $d && $d->format($format) == $date;
	}

	if(isset($data->birth)){
		$date = $data->birth;
		$date = str_replace(' ', '-', $date);
			list($day, $month, $year) = explode('-', $date);
			$day = substr($day,0,strlen($day)-2);
			$user->birth = date('Y-m-d', strtotime($date));
	}
	
	$user->gender = $data->gender;
	$user->phone_code = $data->phone_code;
	$user->pnum = $data->pnum;
	$user->email = $data->email;
	$user->password = $data->password;	
	$_SESSION['email'] = $data->email;
	$results = $user->create_user();

	if($results == false){
		$json['status'] = 'This account already exists.';
		echo json_encode($json);
	}else if(!empty($results)){
		$json = array();
		$json['message'] = 'Successfully Created. Check your inbox for a verification email.';
		echo json_encode($json);
		require 'sendemail.php';
	}
?>
