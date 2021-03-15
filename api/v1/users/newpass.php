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
	$result = $user->newpass($data['email'],$data['pass'],$data['hash']);

	if($result != "1"){
		echo json_encode(array('status' => 'Error!'));
	}else{
		echo json_encode(array('message' => 'Your password has been successfully changed!'));
	}
?>