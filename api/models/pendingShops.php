<?php
	/**
	 * 
	 */
	class Pending_Shop
	{
		private $conn;
		public $id;
		public $sname;
		public $stype;
		public $email;
		public $name;
		public $pnum;

		public function __construct($db)
		{
			$this->conn = $db;
		}
		
		//CREATE NEW PENDING SHOP
		public function create_pendingShop(){
			$this->sname = htmlspecialchars(strip_tags($this->sname));
			$this->stype = htmlspecialchars(strip_tags($this->stype));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$this->name = htmlspecialchars(strip_tags($this->name));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));

			$sql = 'CALL create_pendingShop("'.$this->sname.'","'.$this->stype.'","'.$this->email.'","'.$this->name.'"
			,"'.$this->pnum.'")';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}

		//DELETE PENDING SHOP BY ID
		public function delete_pendingShop(){
			$this->id = htmlspecialchars(strip_tags($this->id));
			$sql = 'CALL delete_pendingShop("'.$this->id.'")';
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