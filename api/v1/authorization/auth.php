<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	include_once '../../config/config.php';
	include_once '../../models/token.php';
	include_once 'vendor/autoload.php';

	$database = new Connection();
	$db = $database->connect();

	$token = new Token($db);

	if($token->auth()){
		echo json_encode($token->auth());
	}else{
		echo json_encode(array('Status' => 'Failed authorization'));
	}
?>