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

	$shops->id = $data['shop_id'];
	$results = $shops->favorites();

	$json = array();
	$json['Shops'] = array();
	if($results != false){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$shop = array(
				'id' => $id,
				'sname' => $sname,
				'stype' => $type,
				'stype_id' => $type_id,
				'email' => $email,
				'pnum' => $pnum,
				'description' => $description,
				'capacity' => $capacity,
				'tables' => $tables,
				'reg_date' => $reg_date,
				'street' => $street,
				'streetnum' => $streetnum,
				'area' => $area,
				'city' => $name,
				'city_id' => $city_id,
				'postal_code' => $pc,
				'rating' => number_format($avg_rating,1),
				'reviewscount' => $reviewscount
			);
			array_push($json['Shops'], $shop);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('status' => 'Server error, please try again!'));
	}
?>