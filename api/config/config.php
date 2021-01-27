<?php
class Connection {

	private $hostname = "";
	private $username = "";
	private $password = "";
	private $dbname   = "";
	private $dbport = "";
	
	function connect(){
		try{
			$conn = new mysqli($this->hostname, $this->username, $this->password, $this->dbname, $this->dbport);
			return $conn;
		}catch(PDOException $e){
			echo 'Connection Error: '. $e->getMessage();
			exit();
		}
 	}
 
	function close($conn){
 		$conn -> close();
 	}
}
?>


