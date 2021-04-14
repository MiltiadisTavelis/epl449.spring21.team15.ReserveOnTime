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
	$shop->image_type = $data['image_type'];
	$shop->image_url = $data['image_url'];
 	if($shop->delete_images()){
 		unlink($data['image_url']);
		$msg['message'] = 'Successfully Deleted Image';
		echo json_encode($msg);
	}else{
		$msg['status'] = 'Error uploading images! Please try again!';
		echo json_encode($msg);
	}
?>