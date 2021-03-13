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
	$user->phone_code = $data->phone_code;
	$user->pnum = $data->pnum;
	$user->email = $data->email;
	$user->password = $data->password;	
	$_SESSION['email'] = $data->email;
	$results = $user->create_user();

	if(!empty($results)){
		$json = array();
		$json['status'] = 'Successfully Created';
		echo json_encode($json);
		require 'sendemail.php';
		//$json['verify'] = 'Click here to verify: '.$results;
	}
?>
