<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	//include_once '../../config/config.php';
	//include_once '../../models/shops.php';

	$database = new Connection();
	$db = $database->connect();

	$shops = new Shops($db);
	if(isset($data['sname'])){
		if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $data['sname'])){
			echo json_encode(array('SpecialCharError' => 'Bad Request'));
			return; 
		}
		$shops->sname = $data['sname'];
	}
	if(isset($data['stype']) && ($data['stype'] >= 1) && ($data['stype'] <= 11)){
		$shops->stype = $data['stype'];
	}
	if(isset($data['sort']) && ((strcasecmp($data['sort'], 'newest') == 0) || (strcasecmp($data['sort'], 'oldest') == 0) || (strcasecmp($data['sort'], 'rating') == 0)) ){
		$shops->sort = $data['sort'];
	}
	if(isset($data['open']) && $data['open'] == 1){
		$shops->open = $data['open'];
	}
	if(isset($data['city']) && $data['city'] == 1){
		$shops->city = $data['city'];
	}	

	$results = $shops->shops();
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Shops'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$shop = array(
				'id' => $id,
				'sname' => $sname,
				'stype' => $type,
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
				'postal_code' => $pc,
				'rating' => number_format($avg_rating,1)
			);
			array_push($json['Shops'], $shop);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('NoShopsFound' => 'There are no Shops on the Server'));
	}
?>