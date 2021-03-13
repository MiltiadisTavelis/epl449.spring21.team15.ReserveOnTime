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

	$user->user();

	$json = array(
		'id' => $user->id,
		'fname' => $user->fname,
		'lname' => $user->lname,
		'gender' => $user->gender,
		'phone_code' => $user->phone_code,
		'pnum' => $user->pnum,
		'email' => $user->email,
		'usetype' => $user->usertype,
		'verify' => $user->verify
	);

	print_r(json_encode($json));
?>