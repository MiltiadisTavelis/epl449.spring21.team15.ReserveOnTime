<?php
	header('Access-Control-Allow-Methods: PUT');
	
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

	$user->id = $data->id;

	if($user->delete_user()){
		$msg['status'] = 'Successfully Deleted';
		echo json_encode($msg);
	}
?>