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

	if(isset($_SESSION['user_id'])){
		$user->id = $_SESSION['user_id'];
	}else{
		echo json_encode(array('status' => 'No online user found'));
		exit();
	}

	$user->shop();
	
	$json = array(
		'shop_id' => $user->shop_id
	);

	print_r(json_encode($json));
?>