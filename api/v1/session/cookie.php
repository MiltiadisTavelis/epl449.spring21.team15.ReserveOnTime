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


	$email = $data['email'];
	$password = hash("sha256", $data['password']);


    if (!isset($_COOKIE["email_cookie"]) && !isset($_COOKIE["password_cookie"])) {
        setcookie("email_cookie", $email, time()+60*60*24*30, '/');
        setcookie("password_cookie", $password, time()+60*60*24*30, '/');
    }
    else echo "cookies already set";
            
?>
