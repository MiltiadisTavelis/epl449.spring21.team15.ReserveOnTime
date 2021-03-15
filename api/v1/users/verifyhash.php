<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);
	$result = $user->verifyhash($data['email'],$data['hash']);

	if($result != "1"){
		echo json_encode(array('status' => 'Invalid hash!'));
	}else{
		echo json_encode(array('message' => 'Valid hash!'));
	}
?>