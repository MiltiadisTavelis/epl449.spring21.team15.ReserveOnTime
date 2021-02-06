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
		public $allrating;
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
		public function create_review(){
			$sql = 'INSERT INTO REVIEWS (
							shop_id,
							uid,
							content,
							rating,
							sub_date) VALUES (?,?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->shop_id = htmlspecialchars(strip_tags($this->shop_id));
			$this->uid = htmlspecialchars(strip_tags($this->uid));
			$this->content = htmlspecialchars(strip_tags($this->content));
			$this->rating = htmlspecialchars(strip_tags($this->rating));
			$this->sub_date = new DateTime();
			$this->sub_date = date_format($this->sub_date, 'Y-m-d H:i:s');

			$stmt->bind_param('iisis',
										$this->shop_id,
										$this->uid,
										$this->content,
										$this->rating,
										$this->sub_date);
			if($stmt->execute() && $this->calculate_rating() && $this->update_rating()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//CALCULATE AVERAGE RATING
		private function calculate_rating(){
			//SELECT CAST(AVG(REVIEWS.rating) AS DECIMAL(2,1)) AS avg_rating
			$sql = '
			SELECT ROUND(AVG(REVIEWS.rating), 1) AS avg_rating
			FROM REVIEWS
			WHERE REVIEWS.shop_id = '.$this->shop_id;
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				$result = $stmt->get_result();
				$row = $result->fetch_array(MYSQLI_ASSOC);
				$this->allrating = $row["avg_rating"];
				return true;
			}
			printf("Error: %s.\n",$stmt->error);
			return false;
		}

		//UPDATE AVERAGE RATING
		private function update_rating(){
			$sql = 'UPDATE SHOPS SET avg_rating = '.$this->allrating.' WHERE SHOPS.id = '.$this->shop_id;
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}
			printf("Error: %s.\n",$stmt->error);
			return false;
		}

		//DELETE REVIEW BY ID
		public function delete_review(){
			$sql = 'DELETE FROM REVIEWS WHERE id=?';
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