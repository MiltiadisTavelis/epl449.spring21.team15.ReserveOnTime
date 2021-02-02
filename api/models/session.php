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
		public $usertype;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//LOGIN
		public function login(){
			$sql = 'SELECT id,password,verify,fname,usertype FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('s',$this->email);
			if($stmt->execute()){
				$result = $stmt->get_result();
				$row = $result->fetch_array(MYSQLI_ASSOC);
				$count = mysqli_num_rows($result);
				$this->id = $row['id'];
	            $this->verify = $row['verify'];
	            $this->usertype = $row['usertype'];
	            $pass = $row['password'];

				if($count == 1){

					if($this->verify == 0){
	            		return 3;
	            	}elseif($this->password == $pass){
	            		$this->fname = $row['fname'];
	        			$_SESSION['user_name'] = $this->fname;
	        			$_SESSION['user_id'] = $this->id;
	        			$_SESSION['user_type'] = $this->usertype;
	        			$_SESSION['page_type'] = "u";
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

		//MANAGER LOGIN
		public function mlogin(){
			$sql = 'SELECT id,password,verify,fname,usertype FROM USERS WHERE email = ? AND usertype = "m"';
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('s',$this->email);
			if($stmt->execute()){
				$result = $stmt->get_result();
				$row = $result->fetch_array(MYSQLI_ASSOC);
				$count = mysqli_num_rows($result);
				$this->id = $row['id'];
	            $this->verify = $row['verify'];
	            $this->usertype = $row['usertype'];
	            $pass = $row['password'];

				if($count == 1){

					if($this->verify == 0){
	            		return 3;
	            	}elseif($this->password == $pass){
	            		$this->fname = $row['fname'];
	        			$_SESSION['user_name'] = $this->fname;
	        			$_SESSION['user_id'] = $this->id;
	        			$_SESSION['user_type'] = $this->usertype;
	        			$_SESSION['page_type'] = "m";
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

		//CHECK IF A USER IS A MANAGER
		public function ismanager(){
			if($_SESSION['user_type'] == "m"){
				return true;
			}else{
				return false;
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