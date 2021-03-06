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
			// execute the stored procedure
            $sql = 'CALL shop_review('.$this->shop_id.')';
            $stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return $stmt->get_result();
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}
		
		//CREATE NEW REVIEW
		public function create_review(){
			$this->shop_id = htmlspecialchars(strip_tags($this->shop_id));
			$this->uid = htmlspecialchars(strip_tags($this->uid));
			$this->content = htmlspecialchars(strip_tags($this->content));
			$this->rating = htmlspecialchars(strip_tags($this->rating));
			$this->sub_date = new DateTime();
			$this->sub_date = date_format($this->sub_date, 'Y-m-d H:i:s');
			$sql = 'CALL create_review("'.$this->shop_id.'","'.$this->uid.'","'.$this->content.'","'.$this->rating.'","'.$this->sub_date.'")';
			
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute() && $this->calculate_rating() && $this->update_rating()){
				return true;
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}

		//CALCULATE AVERAGE RATING
		private function calculate_rating(){
			//SELECT CAST(AVG(REVIEWS.rating) AS DECIMAL(2,1)) AS avg_rating
			$sql = 'CALL calculate_rating('.$this->shop_id.')';
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
			$sql = 'CALL update_rating("'.$this->allrating.'", "'.$this->shop_id.'")';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}
			printf("Error: %s.\n",$stmt->error);
			return false;
		}

		//DELETE REVIEW BY ID
		public function delete_review(){
			$this->id = htmlspecialchars(strip_tags($this->id));
			$sql = 'CALL delete_review('.$this->id.')';
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