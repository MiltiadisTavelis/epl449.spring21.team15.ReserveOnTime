<?php
	session_start();
    $http_origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
    header("Access-Control-Allow-Origin: $http_origin");
    header("Access-Control-Allow-Credentials: true");
    header('content-type: application/json; charset=utf-8');
	
 	$error = json_encode(array('status' => 'Bad Request'));
	if((strcasecmp($_SERVER['REQUEST_METHOD'], 'POST')) == 0 && (strcasecmp($_SERVER["CONTENT_TYPE"], 'application/json')) == 0){
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
			if((strcasecmp($type, 'shops/all') == 0) && count($data) <= 5){
				include 'shops/all.php';

			//GET SHOP BY ID
			}elseif((strcasecmp($type, 'shops/shop') == 0) && count($data) == 1 && (isset($data['id']) != 0)){
				include 'shops/shop.php';

			//DISPLAY HOURS BY SHOP ID
			}elseif((strcasecmp($type, 'shops/hours') == 0) && count($data) == 1 && (isset($data['shop_id']) != 0)){
				include 'shops/hours.php';

			//CREATE SHOP
			}elseif((strcasecmp($type, 'shops/cshop') == 0) && (count($data) == 8) && (isset($data['sname'],$data['stype'],$data['email'],$data['pnum'],$data['description'],$data['mngid'],$data['capacity'],$data['tables']) != 0)){
				include 'shops/cshop.php';

			//ADD OPEN HOURS TO SHOP
			}elseif((strcasecmp($type, 'shops/addhour') == 0)){
				include 'shops/addhour.php';

			//GET ALL SHOP TYPES
			}elseif((strcasecmp($type, 'shops/types') == 0)){
				include 'shops/types.php';

			//IS FULL
			}elseif((strcasecmp($type, 'shops/isfull') == 0) && count($data) == 1 && (isset($data['shop_id']) != 0)){
				include 'shops/isfull.php';

			}else{
				echo $error;
				http_response_code(400);
			}
		}elseif((strcasecmp(explode("/", $data['type'])[0],'reviews')) == 0){
			include_once '../config/config.php';
			include_once '../models/reviews.php';
			$type = $data['type'];
			unset($data['type']);

			//GET REVIEWS BY SHOP ID
			if((strcasecmp($type, 'reviews/shop') == 0) && count($data) == 1 && (isset($data['shop_id']) != 0)){
				$_GET['id'] = $data['shop_id'];
				include 'reviews/shop.php';

			//CREATE REVIEW
			}elseif((strcasecmp($type, 'reviews/creview') == 0) && (count($data) == 4) && (isset($data['shop_id'],$data['uid'],$data['content'],$data['rating']) != 0)){
				include 'reviews/creview.php';

			}else{
				echo $error;
				http_response_code(400);
			}

		}elseif((strcasecmp(explode("/", $data['type'])[0],'users')) == 0){
			include_once '../config/config.php';
			include_once '../models/users.php';
			$type = $data['type'];
			unset($data['type']);

			//GET USERS BY ID
			if((strcasecmp($type, 'users/user') == 0) && count($data) == 0){
				include 'users/user.php';
			
			//CREATE USER
			}elseif((strcasecmp($type, 'users/cuser') == 0) && (count($data) == 8) && (isset($data['fname'],$data['lname'],$data['birth'],$data['gender'],$data['phone_code'],$data['pnum'],$data['email'],$data['password']) != 0)){
				foreach($data as $in) { 
					if(preg_match('/[\'^£$%&*()}{#~?><>,|=_¬]/', $in)){
						echo json_encode(array('SpecialCharError' => 'Bad Request'));
						return;
					}
				}
				include 'users/cuser.php';

			//SEND VERIFY EMAIL TO USER
			}elseif((strcasecmp($type, 'users/sendemail') == 0) && (count($data) == 1) && (isset($data['email']) != 0)){
				if(preg_match('/[\'^£$%&*()}{#~?><>,|=_¬]/', $data['email'])){
					echo json_encode(array('SpecialCharError' => 'Bad Request'));
					return;
				}
				include 'users/sendemail.php';

			//SEND PASS RESET EMAIL TO USER
			}elseif((strcasecmp($type, 'users/passreset') == 0) && (count($data) == 1) && (isset($data['email']) != 0)){
				if(preg_match('/[\'^£$%&*()}{#~?><>,|=_¬]/', $data['email'])){
					echo json_encode(array('SpecialCharError' => 'Bad Request'));
					return;
				}
				include 'users/passreset.php';

			//HASH AND EMAIL CHECK (PASSRESET)
			}elseif((strcasecmp($type, 'users/verifyhash') == 0) && (count($data) == 2) && (isset($data['email'],$data['hash']) != 0)){
				if(preg_match('/[\'^£$%&*()}{#~?><>,|=_¬]/', $data['email'])){
					echo json_encode(array('SpecialCharError' => 'Bad Request'));
					return;
				}
				if(preg_match('/[\'^£$%&*()}{#~?><>,|=_¬]/', $data['hash'])){
					echo json_encode(array('SpecialCharError' => 'Bad Request'));
					return;
				}
				include 'users/verifyhash.php';
			}else{
				echo $error;
				http_response_code(400);
			}
			
		}elseif((strcasecmp(explode("/", $data['type'])[0],'events')) == 0){
			include_once '../config/config.php';
			include_once '../models/events.php';
			$type = $data['type'];
			unset($data['type']);

			//GET EVENTS BY SHOP ID
			if((strcasecmp($type, 'events/shop') == 0) && count($data) == 1 && (isset($data['shop_id']) != 0)){
				//$_GET['id'] = $data['shop_id'];
				include 'events/shop.php';
			
			//CREATE EVENT
			}elseif((strcasecmp($type, 'events/create') == 0) && (count($data) == 7) && (isset($data['title'],$data['content'],$data['pic'],$data['link'],$data['start_date'],$data['stop_date'],$data['shop_id']) != 0)){
				include 'events/create.php';
			}else{
				echo $error;
				http_response_code(400);
			}

		}elseif((strcasecmp(explode("/", $data['type'])[0],'reservations')) == 0){
			include_once '../config/config.php';
			include_once '../models/reservations.php';
			$type = $data['type'];
			unset($data['type']);

			//GET RESERVATIONS
			if((strcasecmp($type, 'reservations/all') == 0)){
				include 'reservations/all.php';
			
			//CREATE NEW RESERVATION
			}elseif((strcasecmp($type, 'reservations/create') == 0) && (count($data) == 4) && (isset($data['day'],$data['people'],$data['shop_id'],$data['time']) != 0)){
				include 'reservations/create.php';
			}else{
				echo $error;
				http_response_code(400);
			}

		}elseif((strcasecmp(explode("/", $data['type'])[0],'pendingShops')) == 0){
			include_once '../config/config.php';
			include_once '../models/pendingShops.php';
			$type = $data['type'];
			unset($data['type']);

			//CREATE PENDING SHOP
			if((strcasecmp($type, 'pendingShops/create') == 0) && (count($data) == 15) && (isset($data['fname'],$data['lname'],$data['gender'],$data['phone_code'],$data['number'],$data['personal_email'],$data['sname'],$data['stype'],$data['city'],$data['province'],$data['address'],$data['postcode'],$data['phone_code2'],$data['shop_number'],$data['shop_email']) != 0)){
				include 'pendingShops/create.php';

			}elseif((strcasecmp($type, 'pendingShops/all') == 0) && (count($data) == 0)){
				include 'pendingShops/all.php';
			}else{
				echo $error;
				http_response_code(400);
			}
		}elseif((strcasecmp(explode("/", $data['type'])[0],'session')) == 0){
			include_once '../config/config.php';
			include_once '../models/session.php';
			$type = $data['type'];
			unset($data['type']);

			//LOGIN
			if((strcasecmp($type, 'session/login') == 0) && (count($data) == 2) && (isset($data['email'],$data['password']) != 0)){
				include 'session/login.php';
			}elseif((strcasecmp($type, 'session/manager') == 0) && (count($data) == 2) && (isset($data['email'],$data['password']) != 0)){
				include 'session/manager.php';
			}elseif((strcasecmp($type, 'session/logout') == 0) && (count($data) == 0)){
				include 'session/logout.php';
			}elseif((strcasecmp($type, 'session/islogin') == 0) && (count($data) == 0)){
				include 'session/islogin.php';
			}elseif((strcasecmp($type, 'session/cookie') == 0) && (count($data) == 2) && (isset($data['email'],$data['password']) != 0)){
				include 'session/cookie.php';
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

		}elseif((strcasecmp(explode("/", $data['type'])[0],'users')) == 0){
			include_once '../config/config.php';
			include_once '../models/users.php';
			$type = $data['type'];
			unset($data['type']);

			//UPDATE USER
			if((strcasecmp($type, 'users/update') == 0) && (count($data) == 6) && (isset($data['fname'],$data['lname'],$data['pnum'],$data['phone_code'],$data['birth'],$data['gender']) != 0)){
				include 'users/update.php';
				
			//UPDATE PASSWORD
			}else if((strcasecmp($type, 'users/newpass') == 0) && (count($data) == 3) && (isset($data['email'],$data['pass'],$data['hash']) != 0)){
				include 'users/newpass.php';
			}else{
				echo $error;
				http_response_code(400);
			}

		}elseif((strcasecmp(explode("/", $data['type'])[0],'events')) == 0){
			include_once '../config/config.php';
			include_once '../models/events.php';
			$type = $data['type'];
			unset($data['type']);

			//UPDATE EVENT
			if((strcasecmp($type, 'events/update') == 0) && (count($data) == 7) && (isset($data['id'],$data['title'],$data['content'],$data['pic'],$data['link'],$data['start_date'],$data['stop_date']) != 0)){
				include 'events/update.php';
			}else{
				echo $error;
				http_response_code(400);
			}

		}elseif((strcasecmp(explode("/", $data['type'])[0],'reservations')) == 0){
			include_once '../config/config.php';
			include_once '../models/reservations.php';
			$type = $data['type'];
			unset($data['type']);

			//UPDATE RESERVATION
			if((strcasecmp($type, 'reservations/update') == 0) && (count($data) == 3) && (isset($data['id'],$data['people'],$data['day']) != 0)){
				include 'reservations/update.php';
			}elseif((strcasecmp($type, 'reservations/status') == 0) && (count($data) == 2) && (isset($data['id'],$data['status']) != 0)){
				include 'reservations/status.php';
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

		}elseif((strcasecmp(explode("/", $data['type'])[0],'events')) == 0){
			include_once '../config/config.php';
			include_once '../models/events.php';
			$type = $data['type'];
			unset($data['type']);

			//DELETE EVENT
			if((strcasecmp($type, 'events/delete') == 0) && (count($data) == 1) && (isset($data['id']) != 0)){
				include 'events/delete.php';
			}else{
				echo $error;
				http_response_code(400);
			}

		}elseif((strcasecmp(explode("/", $data['type'])[0],'pendingShops')) == 0){
			include_once '../config/config.php';
			include_once '../models/pendingShops.php';
			$type = $data['type'];
			unset($data['type']);

			//DELETE EVENT
			if((strcasecmp($type, 'pendingShops/delete') == 0) && (count($data) == 1) && (isset($data['id']) != 0)){
				include 'pendingShops/delete.php';
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
		http_response_code(400);
	}
?>
