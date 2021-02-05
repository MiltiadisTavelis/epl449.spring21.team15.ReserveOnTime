<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	//include_once '../../config/config.php';
	//include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();
	$shops = new Shops($db);
	$shops->id = isset($_GET['id']) ? $_GET['id'] : die();
	$shops->shop();

	$json = array(
		'id' => $shops->id,
		'sname' => $shops->sname,
		'stype' => $shops->stype,
		'email' => $shops->email,
		'pnum' => $shops->pnum,
		'description' => $shops->description,
		'capacity' => $shops->capacity,
		'tables' => $shops->tables,
		'reg_date' => $shops->reg_date,
		'street' => $shops->street,
		'streetnum' => $shops->streetnum,
		'area' => $shops->area,
		'city' => $shops->city,
		'postal_code' => $shops->pc
	);

	print_r(json_encode($json));
?>