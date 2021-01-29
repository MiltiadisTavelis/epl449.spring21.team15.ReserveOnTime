<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);

	$result = $user->geturl($data['email']);
	if($result == 0){
		$msg['status'] = 'Already Verified';
		echo json_encode($msg);
	}elseif($result == 3){
		$msg['status'] = 'Please make sure you have submited the right email address';
		echo json_encode($msg);
	}elseif(empty($result)){
		$msg['status'] = 'Server Error! Please try again';
		echo json_encode($msg);
	}else{
		echo json_encode(array('link' => $result));
	}
?>