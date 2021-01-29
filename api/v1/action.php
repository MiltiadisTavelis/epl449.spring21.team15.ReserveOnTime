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

			//GET ALL SHOPS (OPTIONAL: SORT BY DAY ADDED, GET SHOPS BY TYPE, GET OPEN SHOPS, SEARCH BY NAME)
			if((strcasecmp($type, 'shops/all') == 0) && count($data) <= 4){
				if(isset($data['sname'])){
					if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $data['sname'])){
						echo json_encode(array('SpecialCharError' => 'Bad Request'));
						return;
					}
					$_GET['sname'] = $data['sname'];
				}
				if(isset($data['stype']) && ($data['stype'] >= 1) && ($data['stype'] <= 11)){
					$_GET['stype'] = $data['stype'];
				}
				if(isset($data['sort']) && ((strcasecmp($data['sort'], 'newest') == 0) || (strcasecmp($data['sort'], 'oldest') == 0)) ){
					$_GET['sort'] = $data['sort'];
				}
				if(isset($data['open']) && $data['open'] == 1){
					$_GET['open'] = $data['open'];
				}
				include 'shops/all.php';

			//GET SHOP BY ID
			}elseif((strcasecmp($type, 'shops/shop') == 0) && count($data) == 1 && (isset($data['id']) != 0)){
				$_GET['id'] = $data['id'];
				include 'shops/shop.php';

			}else{
				echo $error;
			}
		}elseif((strcasecmp(explode("/", $data['type'])[0],'reviews')) == 0){
			include_once '../config/config.php';
			include_once '../models/reviews.php';
			$type = $data['type'];
			unset($data['type']);
			if((strcasecmp($type, 'reviews/shop') == 0) && count($data) == 1 && (isset($data['shop_id']) != 0)){
				$_GET['id'] = $data['shop_id'];
				include 'reviews/shop.php';
			}else{
				echo $error;
			}
		}
		else{
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
		}elseif((strcasecmp(explode("/", $data['type'])[0],'reviews')) == 0){
			include_once '../config/config.php';
			include_once '../models/reviews.php';
			$type = $data['type'];
			unset($data['type']);

			//CREATE REVIEW
			if((strcasecmp($type, 'reviews/creview') == 0) && (count($data) == 4) && (isset($data['shop_id'],$data['uid'],$data['content'],$data['rating']) != 0)){
				include 'reviews/creview.php';
			}else{
				echo $error;
				http_response_code(400);
			}
		}

		else{
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
	}elseif((strcasecmp($_SERVER['REQUEST_METHOD'], 'DELETE')) == 0 && (strcasecmp($_SERVER["CONTENT_TYPE"], 'application/json')) == 0){

		$data = json_decode(file_get_contents("php://input"),true);

		if(json_last_error() !== JSON_ERROR_NONE || empty($data) || !isset($data['type'])){
			echo $error;
			http_response_code(400);
			return;
		}elseif((strcasecmp(explode("/", $data['type'])[0],'users')) == 0){
			include_once '../config/config.php';
			include_once '../models/users.php';
			$type = $data['type'];
			unset($data['type']);

			//DELETE USER
			if((strcasecmp($type, 'users/delete') == 0) && (count($data) == 1) && (isset($data['id']) != 0)){
				include 'users/delete.php';
			}else{
				echo $error;
				http_response_code(400);
			}
		}
		elseif((strcasecmp(explode("/", $data['type'])[0],'reviews')) == 0){
			include_once '../config/config.php';
			include_once '../models/reviews.php';
			$type = $data['type'];
			unset($data['type']);

			//DELETE REVIEW
			if((strcasecmp($type, 'reviews/delete') == 0) && (count($data) == 1) && (isset($data['id']) != 0)){
				include 'reviews/delete.php';
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
