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
			$sql = 'INSERT INTO PENDING_SHOPS (
							sname,
							stype,
							email,
							name,
							pnum) VALUES (?,?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->sname = htmlspecialchars(strip_tags($this->sname));
			$this->stype = htmlspecialchars(strip_tags($this->stype));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$this->name = htmlspecialchars(strip_tags($this->name));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));

			$stmt->bind_param('ssssi',
										$this->sname,
										$this->stype,
										$this->email,
										$this->name,
										$this->pnum);
			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//DELETE PENDING SHOP BY ID
		public function delete_pendingShop(){
			$sql = 'DELETE FROM PENDING_SHOPS WHERE id=?';
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