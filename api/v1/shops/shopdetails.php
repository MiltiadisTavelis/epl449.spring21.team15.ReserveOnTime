<?php
	header('Access-Control-Allow-Methods: PUT');

	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();
	$shop = new Shops($db);

	$data = json_decode(file_get_contents("php://input"));

	$shop->id = $data->shop_id;
	$shop->sname = $data->sname;
	$shop->stype = $data->stype;
	$shop->email = $data->email;
	$shop->pnum = $data->pnum;
	$shop->city = $data->city;
	$shop->area = $data->area;
	$shop->street = $data->street;
	$shop->postcode = $data->postcode;
	$shop->streetnum = $data->streetnum;
	$shop->description = $data->description;

	if($shop->update_shopdetails()){
		$msg['message'] = 'Successfully Updated Details';
		echo json_encode($msg);
	}else{
		$msg['status'] = 'Error updating shop details !';
		echo json_encode($msg);
	}
?>