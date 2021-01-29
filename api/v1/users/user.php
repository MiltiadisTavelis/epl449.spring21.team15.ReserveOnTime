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
	$user->id = isset($_GET['id']) ? $_GET['id'] : die();
	$user->user();

	$json = array(
		'id' => $user->id,
		'fname' => $user->fname,
		'lname' => $user->lname,
		'phone_code' => $user->phone_code,
		'pnum' => $user->pnum,
		'email' => $user->email,
		'usetype' => $user->usertype,
		'verify' => $user->verify
	);

	print_r(json_encode($json));
?>