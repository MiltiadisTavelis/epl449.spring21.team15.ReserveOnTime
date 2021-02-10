<?php
	header('Access-Control-Allow-Methods: POST');
	
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/pendingShops.php';

	$database = new Connection();
	$db = $database->connect();
	$pshop = new Pending_Shop($db);

	$data = json_decode(file_get_contents("php://input"));

	$pshop->sname = $data->sname;
	$pshop->stype = $data->stype;
	$pshop->email = $data->email;
	$pshop->name = $data->name;
	$pshop->pnum = $data->pnum;

	if($pshop->create_pendingShop()){
		$msg['status'] = 'Successfully Created';
		echo json_encode($msg);
	}
?>