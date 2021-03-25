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

	$results = $pshop->pendingShops();
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Shops'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$shop = array(
				'fname' => $fname,
				'lname' => $lname,
				'gender' => $gender,
				'pcode' => $phone_code,
				'number' => $number,
				'personal_email' => $personal_email,
				'sname' => $sname,
				'stype' => $stype,
				'city' => $city,
				'province' => $province,
				'address' => $address,
				'postcode' => $postcode,
				'shop_pcode' => $phone_code2,
				'shop_number' => $shop_number,
				'shop_email' => $shop_email
			);
			array_push($json['Shops'], $shop);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('NoShopsFound' => 'There are no Pending Shops on the Server'));
	}
?>