<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

   	if(isset($_SESSION['user_name'])){
   		$name = $_SESSION['user_name'];
	   	if(session_destroy()) {
	      	$msg['message'] = 'Bye '.$name;
			echo json_encode($msg);
	   	}
   	}else{
   		$msg['status'] = 'Please login to be able to logout';
		echo json_encode($msg);
   	}
?>