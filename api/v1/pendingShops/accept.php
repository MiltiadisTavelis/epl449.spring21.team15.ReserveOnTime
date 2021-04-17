<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/pendingShops.php';

	$database = new Connection();
	$db = $database->connect();
	$pshop = new Pending_Shop($db);

	$data = json_decode(file_get_contents("php://input"));

	$pshop->id = $data->id;

	if($pshop->accept_pendingShop()){
		$msg['message'] = 'Successfully Accepted';
		echo json_encode($msg);
	}else{
		$msg['status'] = 'Server Error. Please try again.';
		echo json_encode($msg);
	}
?>