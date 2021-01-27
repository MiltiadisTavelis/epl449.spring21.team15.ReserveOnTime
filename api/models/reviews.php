<?php
	/**
	 * 
	 */
	class Review
	{
		private $conn;
		public $id;
		public $shop_id;
		public $uid;
		public $content;
		public $rating;
		public $sub_date;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//SHOW REVIEWS BY shop_id
		public function shop_reviews(){
			$sql = 'SELECT fname, lname, content,rating,sub_date  FROM REVIEWS,USERS WHERE REVIEWS.uid = USERS.id and REVIEWS.shop_id = '.$this->shop_id.' ORDER BY sub_date DESC';
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

		
		//CREATE NEW REVIEW
		public function create_shop(){
			$sql = 'INSERT INTO SHOPS (
							sname,
							stype,
							email,
							pnum,
							description,
							mngid,
							capacity,
							tables,
							reg_date) VALUES (?,?,?,?,?,?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->sname = htmlspecialchars(strip_tags($this->sname));
			$this->stype = htmlspecialchars(strip_tags($this->stype));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));
			$this->description = htmlspecialchars(strip_tags($this->description));
			$this->mngid = htmlspecialchars(strip_tags($this->mngid));
			$this->capacity = htmlspecialchars(strip_tags($this->capacity));
			$this->tables = htmlspecialchars(strip_tags($this->tables));
			$this->reg_date = new DateTime();
			$this->reg_date = date_format($this->reg_date, 'Y-m-d');

			$stmt->bind_param('sssssiiis',
										$this->sname,
										$this->stype,
										$this->email,
										$this->pnum,
										$this->description,
										$this->mngid,
										$this->capacity,
										$this->tables,
										$this->reg_date);
			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

	}
?>