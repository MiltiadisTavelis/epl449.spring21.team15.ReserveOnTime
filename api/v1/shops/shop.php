<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	//include_once '../../config/config.php';
	//include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();
	$shops = new Shops($db);
	$shops->id = $data['id'];
	$shops->shop();
	if($shops->sname != null){
		$json = array(
			'id' => $shops->id,
			'sname' => $shops->sname,
			'stype' => $shops->stype,
			'stype_id' => $shops->type_id,
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
			'city_id' => $shops->city_id,
			'postal_code' => $shops->pc,
			'rating' => number_format($shops->avg_rating, 1),
			'reviewscount' => $shops->reviewscount
		);
		echo json_encode($json);
	}else{
		echo json_encode(array('NoShopsFound' => 'Shop id not found.'));
	}
?>