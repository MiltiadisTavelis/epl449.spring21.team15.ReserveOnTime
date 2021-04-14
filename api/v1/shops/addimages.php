<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();
	$shop = new Shops($db);
	$shop->id = $data['shop_id'];
 	if($shop->add_images()){
		$msg['message'] = 'Successfully Updated';
		echo json_encode($msg);
	}else{
		$msg['status'] = 'Error uploading images! Please try again!';
		echo json_encode($msg);
	}
?>