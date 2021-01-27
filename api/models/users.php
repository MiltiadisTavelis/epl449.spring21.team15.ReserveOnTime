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
		public $gender;
		public $phone_code;
		public $pnum;
		public $email;
		public $usertype;
		public $password;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//GET USER DETAILS BY ID
		public function user(){
			$sql = "SELECT id,fname,lname,phone_code,pnum,email,usertype FROM USERS WHERE id = ?";
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
		}

		//CREATE NEW USER FROM JSON FILE
		public function create_user(){
			$sql = 'INSERT INTO USERS (
							fname,
							lname,
							gender,
							phone_code,
							pnum,
							email,
							password,
							usertype) VALUES (?,?,?,?,?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->fname = htmlspecialchars(strip_tags($this->fname));
			$this->lname = htmlspecialchars(strip_tags($this->lname));
			$this->gender = htmlspecialchars(strip_tags($this->gender));
			$this->phone_code = htmlspecialchars(strip_tags($this->phone_code));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$this->password = htmlspecialchars(strip_tags($this->password));
			$this->usertype = htmlspecialchars(strip_tags($this->usertype));
			$this->password = hash("sha256", $this->password);
			$stmt->bind_param('ssssssss',
										$this->fname,
										$this->lname,
										$this->gender,
										$this->phone_code,
										$this->pnum,
										$this->email,
										$this->password,
										$this->usertype);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

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

	}
?>