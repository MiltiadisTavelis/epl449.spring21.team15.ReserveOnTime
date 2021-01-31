<?php
	/**
	 * 
	 */
	class Users
	{
		private $conn;
		public $id;
		public $fname;
		public $lname;
		public $birth;
		public $gender;
		public $phone_code;
		public $pnum;
		public $email;
		public $usertype;
		public $password;
		public $verify;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//GET USER DETAILS BY ID
		public function user(){
			$sql = "SELECT id,fname,lname,phone_code,pnum,email,usertype,verify FROM USERS WHERE id = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->fname = $row["fname"];
            $this->lname = $row["lname"];
            $this->phone_code = $row["phone_code"];
            $this->pnum = $row["pnum"];
            $this->email = $row["email"];
            $this->usertype = $row["usertype"];
            $this->verify = $row["verify"];
		}

		//GET USER DETAILS BY ID
		public function name(){
			$sql = 'SELECT fname,lname FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('s',$this->email);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->fname = $row["fname"];
            $this->lname = $row["lname"];
            return $this->fname.' '.$this->lname;
		}

		//GET USER ID BY EMAIL (helper method)
		private function getid($s){
			$sql = 'SELECT USERS.id FROM USERS WHERE email = "'.$s.'"';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				$row = $stmt->get_result();
				$row = $row->fetch_array(MYSQLI_ASSOC);
				return $row['id'];
			}else{
				return "";
			}
		}

		//CREATE NEW USER
		public function create_user(){
			$sql = 'INSERT INTO USERS (
							fname,
							lname,
							birth,
							gender,
							phone_code,
							pnum,
							email,
							password,
							usertype) VALUES (?,?,?,?,?,?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->fname = htmlspecialchars(strip_tags($this->fname));
			$this->lname = htmlspecialchars(strip_tags($this->lname));
			$this->birth = htmlspecialchars(strip_tags($this->birth));
			$this->gender = htmlspecialchars(strip_tags($this->gender));
			$this->phone_code = htmlspecialchars(strip_tags($this->phone_code));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$this->password = htmlspecialchars(strip_tags($this->password));
			$this->password = hash("sha256", $this->password);
			$this->usertype = 'u';

			$stmt->bind_param('sssssssss',
										$this->fname,
										$this->lname,
										$this->birth,
										$this->gender,
										$this->phone_code,
										$this->pnum,
										$this->email,
										$this->password,
										$this->usertype);


			if($stmt->execute()){
				$id = '"'.$this->getid($this->email).'"';
				$hash = md5(rand(0,1000));
				$sql = 'INSERT INTO PENDING_USER SET user_id = '.$id.', code = "'.$hash.'"';
				$stmt = $this->conn->prepare($sql);

				if(!$stmt->execute()){
					printf("Verify Error: %s.\n",$stmt->error);
					return false;
				}

				$results = $this->geturl($this->email);
				if(!empty($results)){
					return $results;
				}else{
					printf("Verify Error: %s.\n",$stmt->error);
					return false;
				}
			}

			printf("User Error: %s.\n",$stmt->error);

			return false;
		}

		//UPDATE USER DETAILS BY ID
		public function update_user(){
			$sql = 'UPDATE USERS SET
							fname = ?,
							lname = ?,
							phone_code = ?,
							pnum = ?,
							email = ?
							WHERE id=?';
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			$this->fname = htmlspecialchars(strip_tags($this->fname));
			$this->lname = htmlspecialchars(strip_tags($this->lname));
			$this->phone_code = htmlspecialchars(strip_tags($this->phone_code));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$stmt->bind_param('sssssi',
										$this->fname,
										$this->lname,
										$this->phone_code,
										$this->pnum,
										$this->email,
										$this->id);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//DELETE USER BY ID
		public function delete_user(){
			$sql = 'DELETE FROM USERS WHERE id=?';
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			$stmt->bind_param('i',$this->id);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}


		//GET URL FOR VERIFICATION
		public function geturl($e){
			if(!$this->exist($e)){
				return 3; 
			}

			$result = $this->isverified($e);

			if($result == true){
            	return 0;
            }

            $hash = $this->getidhash($this->getid($e));

			if(!empty($hash)){
				return 'reserveontime.com/api/v1/verify?hash='.$hash.'&email='.$e;
			}else{
				return "";
			}
		}

		//VERIFY USER
		public function verify_user(){
			//Check if user exist
			if(!$this->exist($this->email)){
				return 3; 
			}

			//Check if he is already verified
			if($this->isverified($this->email)){
            	return 0;
            }

            //Get the id by email
			$this->id = $this->getid($this->email);

			//If is empty something went wrong so return 3
            if(empty($this->id)){
            	return 3;
            }

            //Else get the hash
            $hash = $this->getidhash($this->id);

            //And if it matches with the one he provides
            if(strcmp($hash, $this->hash)){
            	return 3;
            }

            //Then authorize the account by deleting the hash from pending users
            if($this->delete_hash($this->id) == false){
            	return -1;
            }

            //And verify the account
            if($this->verify($this->id) == false){
            	return -1;
            }
            return 1;
		}

		//CHECK IF A USER IS VERIFIED (INPUT: EMAIL) (helper method)
		private function isverified($e){
			$sql = 'SELECT verify FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$e = htmlspecialchars(strip_tags($e));
			$stmt->bind_param('s',$e);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->verify = $row["verify"];

            if($this->verify == 1){
            	return true;
            }elseif($this->verify == 0){
            	return false;
            }else{
            	printf("User Error: %s.\n",$stmt->error);
            	return;
            }
            
		}

		//CHECK IF A USER EXIST (INPUT: EMAIL)
		public function exist($e){
			$sql = 'SELECT id FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$e = htmlspecialchars(strip_tags($e));
			$stmt->bind_param('s',$e);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->id = $row["id"];
            if(!empty($this->id)){
            	return true;
            }else{
            	return false;
            }
            
		}

		//GET USER HASH BY ID (helper method)
		private function getidhash($s){
			$sql = 'SELECT code FROM PENDING_USER WHERE user_id = "'.$s.'"';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				$row = $stmt->get_result();
				$row = $row->fetch_array(MYSQLI_ASSOC);
				return $row['code'];
			}else{
				return "";
			}
		}

		//DELETE PENDING USER BY ID (helper method)
		private function delete_hash($id){
			$sql = 'DELETE FROM PENDING_USER WHERE user_id = '.$id;
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			if($stmt->execute()){
			 	return true;
			}
			printf("Error: %s.\n",$stmt->error);
			return false;
		}

		//VERIFY USER verify = 1 (helper method)
		private function verify($id){
			$sql = 'UPDATE USERS SET verify = 1 WHERE USERS.id = '.$id;
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}

	}
?>