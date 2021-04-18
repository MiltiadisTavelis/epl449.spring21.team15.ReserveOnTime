<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);

	$user->id = $_SESSION['user_id'];
	$user->page_type = $_SESSION['page_type'];
	$results = $user->download_data();
	if($results != false){
		$msg['message'] = $results;
		echo json_encode($msg);
	}else{
		$msg['status'] = 'Something went wrong while downloading your data';
		echo json_encode($msg);		
	}
?>