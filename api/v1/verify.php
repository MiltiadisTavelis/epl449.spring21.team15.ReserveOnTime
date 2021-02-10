<?php
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
    header("Access-Control-Allow-Origin: *");
    header('content-type: application/json; charset=utf-8');

	if(!preg_match('/^[a-f0-9]{32}$/', $_GET['hash'])){
		echo json_encode(array('HashError' => 'Please make sure you are using the right URL'));
		return;
	}
	if(!filter_var($_GET['email'], FILTER_VALIDATE_EMAIL)){
		echo json_encode(array('EmailError' => 'No valid email address'));
		return;
	}

	include_once '../config/config.php';
	include_once '../models/users.php';

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);

	$user->email = $_GET['email'];
	$user->hash = $_GET['hash'];
	$result = $user->verify_user();
	if($result == 1){
		$msg['status'] = 'Successfully Verified';
		echo json_encode($msg);
	}elseif($result == 0){
		$msg['status'] = 'Already Verified';
		echo json_encode($msg);
	}elseif($result == 3){
		$msg['status'] = 'Invalid Link ! Please make sure you are using the right URL';
		echo json_encode($msg);
	}else{
		$msg['status'] = 'Server Error! Please try again';
		echo json_encode($msg);
	}
?>