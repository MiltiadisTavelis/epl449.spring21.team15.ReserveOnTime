<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Methods: PUT');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

	// include_once '../../config/config.php';
	// include_once '../../models/pendingShops.php';

	$database = new Connection();
	$db = $database->connect();
	$pshop = new Pending_Shop($db);

	$data = json_decode(file_get_contents("php://input"));

	$pshop->id = $data->id;

	if($pshop->delete_pendingShop()){
		$msg['status'] = 'Successfully Deleted';
		echo json_encode($msg);
	}
?>