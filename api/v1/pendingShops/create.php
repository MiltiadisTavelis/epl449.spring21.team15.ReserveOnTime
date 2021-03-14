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

	$pshop->fname = $data->fname;
	$pshop->lname = $data->lname;
	$pshop->gender = $data->gender;
	$pshop->phone_code = $data->phone_code;
	$pshop->number = $data->number;
	$pshop->personal_email = $data->personal_email;
	$pshop->sname = $data->sname;
	$pshop->stype = $data->stype;
	$pshop->city = $data->city;
	$pshop->province = $data->province;
	$pshop->address = $data->address;
	$pshop->postcode = $data->postcode;
	$pshop->phone_code2 = $data->phone_code2;
	$pshop->shop_number = $data->shop_number;
	$pshop->shop_email = $data->shop_email;

	if($pshop->create_pendingShop()){
		$msg['status'] = 'Successfully Created';
		echo json_encode($msg);
	}
?>