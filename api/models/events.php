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
		public $start_time;
		public $stop_time;
		public $shop_id;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//SHOW EVENTS BY shop_id
		public function shop_event(){
        
            // execute the stored procedure
            $sql = 'CALL shop_events('.$this->shop_id.')';
            $stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return $stmt->get_result();
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}

		//SHOW EVENT DETAILS BY ID
		public function event(){
			$sql = "SELECT id,title,content,pic,link,start_date,stop_date,shop_id FROM EVENTS WHERE id = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->id = $row["id"];
            $this->title = $row["title"];
            $this->content = $row["content"];
            $this->pic = $row["pic"];
            $this->link = $row["link"];
            $this->start_date = $row["start_date"];
            $this->stop_date = $row["stop_date"];
            $this->shop_id = $row["shop_id"];
		}

		
		//CREATE NEW EVENT
		public function create_event(){
			date_default_timezone_set('GMT');
			$start_date = date('N', strtotime(date($this->start_date))); //DAY NUMBER MON=1 ..

			$this->title = htmlspecialchars(strip_tags($this->title));
			$this->content = htmlspecialchars(strip_tags($this->content));
			$this->pic = htmlspecialchars(strip_tags($this->pic));
			$this->link = htmlspecialchars(strip_tags($this->link));
			$this->start_date = htmlspecialchars(strip_tags($this->start_date));
			$this->stop_date = htmlspecialchars(strip_tags($this->stop_date));
			$this->start_time = htmlspecialchars(strip_tags($this->start_time));
			$this->stop_time = htmlspecialchars(strip_tags($this->stop_time));
			$this->shop_id = htmlspecialchars(strip_tags($this->shop_id));

			$this->start_date = date('Y-m-d', strtotime($this->start_date)).' '.$this->start_time;
			$this->stop_date = date('Y-m-d', strtotime($this->stop_date)).' '.$this->stop_time;
			$sql = 'CALL create_event("'.$this->title.'","'.$this->content.'","'.$this->pic.'","'.$this->link.'","'.$this->start_date.'","'.$this->stop_date.'",'.$this->shop_id.')';
			
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}

		//DELETE EVENT BY ID
		public function delete_event(){
			$this->id = htmlspecialchars(strip_tags($this->id));
			$sql = 'CALL delete_event('.$this->id.')';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}

		//UPDATE EVENT DETAILS BY ID
		public function update_event(){
			date_default_timezone_set('GMT');
			$start_date = date('N', strtotime(date($this->start_date))); //DAY NUMBER MON=1 ..

			$this->id = htmlspecialchars(strip_tags($this->id));
			$this->title = htmlspecialchars(strip_tags($this->title));
			$this->content = htmlspecialchars(strip_tags($this->content));
			$this->pic = htmlspecialchars(strip_tags($this->pic));
			$this->link = htmlspecialchars(strip_tags($this->link));
			$this->start_date = htmlspecialchars(strip_tags($this->start_date));
			$this->stop_date = htmlspecialchars(strip_tags($this->stop_date));
			$this->start_time = htmlspecialchars(strip_tags($this->start_time));
			$this->stop_time = htmlspecialchars(strip_tags($this->stop_time));

			$this->start_date = date('Y-m-d', strtotime($this->start_date)).' '.$this->start_time;
			$this->stop_date = date('Y-m-d', strtotime($this->stop_date)).' '.$this->stop_time;

			$sql = 'CALL update_event("'.$this->title.'","'.$this->content.'","'.$this->pic.'","'.$this->link.'","'.$this->start_date.'","'.$this->stop_date.'","'.$this->id.'")';
			
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