<?php
	/**
	 * 
	 */
	class Reservation
	{
		private $conn;
		public $id;
		public $day;
		public $people;
		public $shopid;
		public $userid;
		public $status;
		public $sort;
		public $lname;
		public $phone;
		public $shop;
		public $today;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//SHOW ALL
		public function reservations(){
			$where = array();
			$sql = 'SELECT RESERVATIONS.id, RESERVATIONS.shopid, RESERVATIONS.day, RESERVATIONS.people, STATUS.status, SHOPS.sname';
			$order = '';

			if(isset($this->shopid) && $_SESSION['page_type'] == "m"){
				$sql .= ', USERS.fname, USERS.lname, USERS.pnum FROM RESERVATIONS,SHOPS,STATUS,USERS WHERE RESERVATIONS.shopid = SHOPS.id AND USERS.id = RESERVATIONS.userid AND SHOPS.mngid = '.$_SESSION['user_id'].' AND SHOPS.id = '.$this->shopid.' AND STATUS.sid = RESERVATIONS.status ';
			}elseif($_SESSION['page_type'] == "u"){
				$sql .= ' FROM RESERVATIONS, SHOPS,STATUS WHERE RESERVATIONS.shopid = SHOPS.id AND RESERVATIONS.userid = '.$_SESSION['user_id'].' AND STATUS.sid = RESERVATIONS.status ';
			}else{
				return -1;
			}
			
			date_default_timezone_set('GMT');
			$day = date('N', strtotime(date('l'))); //DAY NUMBER MON=1 .. 
			$time = date("Y-m-d H:m:s",time()+(2*60*60)); //GMT+2 (CYPRUS)
			$time2 = date("Y-m-d",time()+(2*60*60)); //GMT+2 (CYPRUS)

			if($this->today == "1"){
				$sql .= 'AND RESERVATIONS.day >= "'.$time.'" AND DATE(RESERVATIONS.day) = "'.$time2.'" ';
			}elseif($this->today == "0"){
				$sql .= 'AND RESERVATIONS.day < "'.$time.'" ';
			}elseif($this->today == "2"){
				$sql .= 'AND RESERVATIONS.day >= "'.$time.'" AND RESERVATIONS.status = 1 ';
			}

			if(isset($this->status)){
				$sql .= 'AND RESERVATIONS.status = '.$this->status.' ';
			}
			
			if(isset($this->lname) && !preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $this->lname)){
			    $sql .= 'AND USERS.lname LIKE \'%'.$this->lname.'%\' ';
			}elseif(isset($this->phone) && preg_match('/^[0-9 ]*$/', $this->phone) == 1){
				$sql .= 'AND USERS.pnum LIKE \''.$this->phone.'%\' ';
			}elseif(isset($this->shop) && !preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $this->shop)){
				$sql .= 'AND SHOPS.sname LIKE \'%'.$this->shop.'%\' ';
			}

			if(isset($this->sort) && (strcasecmp($this->sort, 'oldest') == 0)){
			    $order = 'ORDER BY RESERVATIONS.day';
			}else{
			    $order = 'ORDER BY RESERVATIONS.day DESC';
			}

			if(isset($order)){
				$sql .= ''.$order;
			}

			$stmt = $this->conn->prepare($sql);
	        if(!mysqli_stmt_prepare($stmt,$sql)){
	            echo "Error";
	            exit();
	        }else{
	        	mysqli_stmt_execute($stmt);
	           	$result = mysqli_stmt_get_result($stmt);
	          	return $result;
	        }
		}

		//CHECK IF RESERVATION IS OWNED BY THE USER (helper method)
		private function check_shop(){
			$sql = 'SELECT * FROM SHOPS WHERE mngid = '.$_SESSION['user_id'].' AND SHOPS.id = '.$this->shopid;
			$stmt = $this->conn->prepare($sql);

			if($stmt->execute()){
				$result = $stmt->get_result();
				$row = $result->fetch_array(MYSQLI_ASSOC);
				$count = mysqli_num_rows($result);
				if($count == 1){
           	        return true;
				}else{
					return false;
				}
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//SHOW SHOP BY ID
		public function shop(){
			$sql = "SELECT id,sname,stype,email,pnum,description,capacity,tables,reg_date FROM SHOPS WHERE id = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->sname = $row["sname"];
            $this->stype = $row["stype"];
            $this->email = $row["email"];
            $this->pnum = $row["pnum"];
            $this->description = $row["description"];
            $this->capacity = $row["capacity"];
            $this->tables = $row["tables"];
            $this->reg_date = $row["reg_date"];
		}

		//UPDATE RESERVATION DETAILS BY ID
		public function update_rsrv(){
			$sql = 'UPDATE RESERVATIONS SET
							day = ?,
							people = ?,
							status = 2
							WHERE userid = '.$_SESSION['user_id'].' AND id = '.$this->id;
			$stmt = $this->conn->prepare($sql);
			$this->day = htmlspecialchars(strip_tags($this->day));
			$this->people = htmlspecialchars(strip_tags($this->people));
			
			$stmt->bind_param('si',
									$this->day,
									$this->people
							);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//CREATE NEW RESERVATION
		public function create_rsrv(){
			$sql = 'INSERT INTO RESERVATIONS (
							day,
							people,
							shopid,
							userid) VALUES (?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->day = htmlspecialchars(strip_tags($this->day));
			$this->people = htmlspecialchars(strip_tags($this->people));
			$this->shopid = htmlspecialchars(strip_tags($this->shopid));

			$stmt->bind_param('siii',
										$this->day,
										$this->people,
										$this->shopid,
										$this->userid);
			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//UPDATE RESERVATION STATUS
		public function status(){
			if($this->check_status()){
				$sql = 'UPDATE RESERVATIONS SET status = '.$this->status.' WHERE id = '.$this->id;
				$stmt = $this->conn->prepare($sql);

				if($stmt->execute()){
					return true;
				}else{
					printf("Error: %s.\n",$stmt->error);
				}
			}
			return false;
		}

		//CHECK IF RESERVATION IS OWNED BY THE USER (helper method)
		private function check_status(){
			$sql = "";
			if($_SESSION['user_type'] == "m" && ($this->status == "0" || $this->status == "1")){
				$sql = 'SELECT * FROM RESERVATIONS,SHOPS WHERE RESERVATIONS.shopid = SHOPS.id AND RESERVATIONS.id = '.$this->id.' AND SHOPS.mngid = '.$_SESSION['user_id'];
			}elseif(($_SESSION['user_type'] == "u" && $this->status == "3") || ($_SESSION['user_type'] == "m" && $this->status == "3")){
				$sql = 'SELECT * FROM RESERVATIONS WHERE RESERVATIONS.id = '.$this->id.' AND RESERVATIONS.userid = '.$_SESSION['user_id'];
			}else{
				return false;
			}

			$stmt = $this->conn->prepare($sql);

			if($stmt->execute()){
				$result = $stmt->get_result();
				$row = $result->fetch_array(MYSQLI_ASSOC);
				$count = mysqli_num_rows($result);
				if($count == 1){
           	        return true;
				}else{
					return false;
				}
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}
	}
?>
