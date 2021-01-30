<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'EmailServiceNo-reply/src/Exception.php';
	require 'EmailServiceNo-reply/src/PHPMailer.php';
	require 'EmailServiceNo-reply/src/SMTP.php';

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);
	$result = "";
	$email = "";
	if(isset($_SESSION['email'])){
		$user->email = $_SESSION['email'];
		$sendto = $_SESSION['email'];
		$result = $user->geturl($_SESSION['email']);
	}else{
		$user->email = $data['email'];
		$sendto = $data['email'];
		$result = $user->geturl($data['email']);
	}
	if($result == "0"){
		$msg['status'] = 'Already Verified';
		echo json_encode($msg);
	}elseif($result == "3"){
		$msg['status'] = 'Please make sure you have submited the right email address';
		echo json_encode($msg);
	}elseif(empty($result)){
		$msg['status'] = 'Server Error! Please try again';
		echo json_encode($msg);
	}else{
		$name = $user->name();
		$mail = new PHPMailer();
		$mail->isSMTP();
		$mail->Host = "mail.reserveontime.com";
		$mail->SMTPAuth = true;
		$mail->Username = "no-reply@reserveontime.com";
		$mail->Password = "";
		$mail->SMTPSecure = 'tls';
		$mail->Port = "587";
		$mail->setFrom('no-reply@reserveontime.com', 'ReserveOnTime');
		$mail->addReplyTo('no-reply@reserveontime.com', 'ReserveOnTime');
		$mail->addAddress($sendto, $name);
		$mail->Subject = "Verify your email address !";
		$mail->isHTML(true);
		$mail->Body = 'Hello '.$name.'. You registered an account on ReserveOnTime, before being able to use your account you need to verify that this is your email address by clicking here: '.$result.' Kind Regards, ReserveOnTime';

		if($mail->send() == false){
		    $msg['status'] = 'Email Error ! '.$mail->ErrorInfo;
			echo json_encode($msg);
		}
		echo json_encode(array('link' => $result));
	}
?>
