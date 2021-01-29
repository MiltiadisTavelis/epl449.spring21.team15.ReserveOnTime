<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Methods: POST');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);

	$data = json_decode(file_get_contents("php://input"));

	$user->fname = $data->fname;
	$user->lname = $data->lname;
	$user->birth = $data->birth;
	$user->gender = $data->gender;
	$user->phone_code = $data->phone_code;
	$user->pnum = $data->pnum;
	$user->email = $data->email;
	$user->password = $data->password;	

	$results = $user->create_user();

	if(!empty($results)){
		$json = array();
		$json['status'] = 'Successfully Created';
		$json['verify'] = 'Click here to verify: '.$results;
		echo json_encode($json);
	}
?>