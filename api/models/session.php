<?php
	/**
	 * 
	 */
	class Session
	{
		private $conn;
		public $email;
		public $password;
		public $id;
		public $verify;
		public $fname;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//LOGIN
		public function login(){
			$sql = 'SELECT id,password,verify,fname FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('s',$this->email);
			if($stmt->execute()){
				$result = $stmt->get_result();
				$row = $result->fetch_array(MYSQLI_ASSOC);
				$count = mysqli_num_rows($result);
				$this->id = $row['id'];
	            $this->verify = $row['verify'];
	            $pass = $row['password'];

				if($count == 1){

					if($this->verify == 0){
	            		return 3;
	            	}elseif($this->password == $pass){
	            		$this->fname = $row['fname'];
	            		return 1;
		            }else{
		            	return 0;
		            }
				}else{
					return 0;
				}

			}else{
				return -1;
			}
		}

		//CHECK IF A USER IS CONNECTED
		public function islogin(){
			if(isset($_SESSION['user_id'])){
				return true;
			}else{
				return false;
			}
		}
	}
?>