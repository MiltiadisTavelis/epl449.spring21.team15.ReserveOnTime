<?php
	header('Access-Control-Allow-Methods: POST');
	
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();
	$shop = new Shops($db);

	$data = json_decode(file_get_contents("php://input"));

	$shop->sname = $data->sname;
	$shop->stype = $data->stype;
	$shop->email = $data->email;
	$shop->pnum = $data->pnum;
	$shop->description = $data->description;
	$shop->mngid = $data->mngid;
	$shop->capacity = $data->capacity;
	$shop->tables = $data->tables;

	if($shop->create_shop()){
		$msg['status'] = 'Successfully Created';
		echo json_encode($msg);
	}
?>