<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/reviews.php';

	$database = new Connection();
	$db = $database->connect();

	if(isset($_SESSION['page_type'])){
		$msg['type'] = $_SESSION['page_type'];
		echo json_encode($msg);
	}else{
		$msg['NoSessionFound'] = "No session found";
		echo json_encode($msg);
	}
?>