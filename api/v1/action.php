<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	$error = json_encode(array('status' => 'Bad Request'));
	if((strcasecmp($_SERVER['REQUEST_METHOD'], 'GET')) == 0 && (strcasecmp($_SERVER["CONTENT_TYPE"], 'application/json')) == 0){
		$data = json_decode(file_get_contents("php://input"),true);

		if(json_last_error() !== JSON_ERROR_NONE || empty($data) || !isset($data['type'])){
			echo $error;
			http_response_code(400);
			return;

		}elseif((strcasecmp(explode("/", $data['type'])[0],'shops')) == 0){
			include_once '../config/config.php';
			include_once '../models/shops.php';
			$type = $data['type'];
			unset($data['type']);
			//GET ALL SHOPS
			if((strcasecmp($type, 'shops/all') == 0) && empty($data)){
				include 'shops/all.php';

			//GET SHOP BY ID
			}elseif((strcasecmp($type, 'shops/shop') == 0) && count($data) == 1 && (isset($data['id']) != 0)){
				$_GET['id'] = $data['id'];
				include 'shops/shop.php';

			//SEARCH SHOP
			}elseif((strcasecmp($type, 'shops/search') == 0) && count($data) == 1  && (isset($data['search']) != 0)){
				$_GET['search'] = $data['search'];
				include 'shops/search.php';

			//SEARCH SHOP BY TYPE
			}elseif((strcasecmp($type, 'shops/type') == 0) && (count($data) == 1) && (isset($data['stype']) != 0)){
				$_GET['stype'] = $data['stype'];
				include 'shops/type.php';

			//SORT SHOPS BY NAME OR REG_DATE
			}elseif((strcasecmp($type, 'shops/sort') == 0) && (count($data) == 1) && (isset($data['sort']) != 0) && in_array($data['sort'], ['sname','reg_date'], true)){
				$_GET['sort'] = $data['sort'];
				include 'shops/sort.php';

			//DISPLAY OPEN SHOPS
			}elseif((strcasecmp($type, 'shops/isopen') == 0) && empty($data)){
				include 'shops/isopen.php';

			}else{
				echo $error;
			}
		}else{
			echo $error;
		}

	}elseif((strcasecmp($_SERVER['REQUEST_METHOD'], 'POST')) == 0 && (strcasecmp($_SERVER["CONTENT_TYPE"], 'application/json')) == 0){

		$data = json_decode(file_get_contents("php://input"),true);

		if(json_last_error() !== JSON_ERROR_NONE || empty($data) || !isset($data['type'])){
			echo $error;
			http_response_code(400);
			return;
		}elseif((strcasecmp(explode("/", $data['type'])[0],'shops')) == 0){
			include_once '../config/config.php';
			include_once '../models/shops.php';
			$type = $data['type'];
			unset($data['type']);

			//CREATE SHOP
			if((strcasecmp($type, 'shops/cshop') == 0) && (count($data) == 8) && (isset($data['sname'],$data['stype'],$data['email'],$data['pnum'],$data['description'],$data['mngid'],$data['capacity'],$data['tables']) != 0)){
				include 'shops/cshop.php';
			}else{
				echo $error;
				http_response_code(400);
			}
		}else{
			echo $error;
			http_response_code(400);
		}
	}elseif((strcasecmp($_SERVER['REQUEST_METHOD'], 'PUT')) == 0 && (strcasecmp($_SERVER["CONTENT_TYPE"], 'application/json')) == 0){

		$data = json_decode(file_get_contents("php://input"),true);

		if(json_last_error() !== JSON_ERROR_NONE || empty($data) || !isset($data['type'])){
			echo $error;
			http_response_code(400);
			return;
		}elseif((strcasecmp(explode("/", $data['type'])[0],'shops')) == 0){
			include_once '../config/config.php';
			include_once '../models/shops.php';
			$type = $data['type'];
			unset($data['type']);

			//UPDATE SHOP
			if((strcasecmp($type, 'shops/update') == 0) && (count($data) == 8) && (isset($data['sname'],$data['stype'],$data['email'],$data['pnum'],$data['description'],$data['id'],$data['capacity'],$data['tables']) != 0)){
				include 'shops/update.php';
			}else{
				echo $error;
				http_response_code(400);
			}

		}else{
			echo $error;
			http_response_code(400);
		}
	}else{
		echo $error;
		echo "string4";
	}
?>
