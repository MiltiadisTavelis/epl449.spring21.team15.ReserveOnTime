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
	$s = isset($_GET['search']) ? $_GET['search'] : die();
	$results = $shops->search($s);
	$cnt = mysqli_num_rows($results);
	$json = array();
	$json['Shops'] = array();
	if($cnt > 0 ){
		while($row = mysqli_fetch_array($results)){
			extract($row);
			$shop = array(
				'id' => $id,
				'sname' => $sname,
				'stype' => $stype,
				'email' => $email,
				'pnum' => $pnum,
				'description' => $description,
				'capacity' => $capacity,
				'tables' => $tables,
				'reg_date' => $reg_date
			);
			array_push($json['Shops'], $shop);
		}
		echo json_encode($json);
	}else{
		echo json_encode(array('NoShopsFound' => 'There are no Shops on the Server'));
	}
?>