<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/reviews.php';

	$database = new Connection();
	$db = $database->connect();
	$session = new Session($db);

	if($session->islogin() == true){
		$msg['status'] = '1';
		echo json_encode($msg);
	}else{
		$msg['status'] = '0';
		echo json_encode($msg);
	}
?>