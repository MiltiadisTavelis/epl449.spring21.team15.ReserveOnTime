<?php
	/**
	 * 
	 */
	class Event
	{
		private $conn;
		public $id;
		public $title;
		public $content;
		public $pic;
		public $link;
		public $start_date;
		public $stop_date;
		public $shop_id;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//SHOW EVENTS BY shop_id
		public function shop_event(){
			$sql = 'SELECT title,content,pic,link,start_date,stop_date  FROM EVENTS WHERE EVENTS.shop_id = '.$this->shop_id.' ORDER BY start_date ';
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

		
		//CREATE NEW EVENT
		public function create_event(){
			$sql = 'INSERT INTO EVENTS (
							title,
							content,
							pic,
							link,
							start_date,
							stop_date,
							shop_id) VALUES (?,?,?,?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->title = htmlspecialchars(strip_tags($this->title));
			$this->content = htmlspecialchars(strip_tags($this->content));
			$this->pic = htmlspecialchars(strip_tags($this->pic));
			$this->link = htmlspecialchars(strip_tags($this->link));
			$this->start_date = htmlspecialchars(strip_tags($this->start_date));
			$this->stop_date = htmlspecialchars(strip_tags($this->stop_date));
			$this->shop_id = htmlspecialchars(strip_tags($this->shop_id));

			$stmt->bind_param('ssssssi',
										$this->title,
										$this->content,
										$this->pic,
										$this->link,
										$this->start_date,
										$this->stop_date,
										$this->shop_id);
			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//DELETE EVENT BY ID
		public function delete_event(){
			$sql = 'DELETE FROM EVENTS WHERE id=?';
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			$stmt->bind_param('i',$this->id);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//UPDATE EVENT DETAILS BY ID
		public function update_event(){
			$sql = 'UPDATE EVENTS SET
							title = ?,
							content = ?,
							pic = ?,
							link = ?,
							start_date = ?,
							stop_date = ?
							WHERE id=?';
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			$this->title = htmlspecialchars(strip_tags($this->title));
			$this->content = htmlspecialchars(strip_tags($this->content));
			$this->pic = htmlspecialchars(strip_tags($this->pic));
			$this->link = htmlspecialchars(strip_tags($this->link));
			$this->start_date = htmlspecialchars(strip_tags($this->start_date));
			$this->stop_date = htmlspecialchars(strip_tags($this->stop_date));

			$stmt->bind_param('ssssssi',
										$this->title,
										$this->content,
										$this->pic,
										$this->link,
										$this->start_date,
										$this->stop_date,
										$this->id);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}
	}
?>