<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	if(!filter_var($data['email'], FILTER_VALIDATE_EMAIL)){
		echo json_encode(array('EmailError' => 'No valid email address'));
		return;
	}

	//include_once '../../config/config.php';
	//include_once '../../models/reviews.php';

	$database = new Connection();
	$db = $database->connect();
	$session = new Session($db);

	$session->email = $data['email'];
	$session->password = hash("sha256", $data['password']);

	if(!$session->islogin()){
		$result = $session->mlogin();
        $msg['status'] = $result;
        if($result == "1") {
            $msg['message'] = 'Welcome '.$_SESSION['user_name']. '!';
            echo json_encode($msg);
        } else {
            if($result == "0"){
                $msg['message'] = 'Wrong email or password';
                echo json_encode($msg);
            }elseif($result == "3"){
                $msg['message'] = 'Please verify your account';
                echo json_encode($msg);
            }else{
                $msg['message'] = 'Server Error! Please try again';
                echo json_encode($msg);
            }
        }
	}else{
		$msg['message'] = 'Your name is '.$_SESSION['user_name'];
		echo json_encode($msg);
	}
?>
