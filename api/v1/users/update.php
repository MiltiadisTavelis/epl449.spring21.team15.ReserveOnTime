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

	$user->id = $data->id;
	$user->fname = $data->fname;
	$user->lname = $data->lname;
	$user->phone_code = $data->phone_code;
	$user->pnum = $data->pnum;
	$user->email = $data->email;

	if($user->update_user()){
		$msg['status'] = 'Successfully Updated';
		echo json_encode($msg);
	}
?>