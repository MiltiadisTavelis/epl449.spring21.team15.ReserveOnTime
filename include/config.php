<?php
class DBController {

	function connect(){
  		$hostname = "";
		$username = "";
		$password = "";
		$dbname   = "";
		$dbport   = "";

 		$conn = new mysqli($hostname, $username, $password, $dbname, $dbport) or die("Failed to connect" . $conn->error);
 		return $conn;
 	}
 
	function close($conn){
 		$conn -> close();
 	}
}
?>


