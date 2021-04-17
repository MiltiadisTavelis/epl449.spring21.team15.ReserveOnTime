<?php
	/**
	 * 
	 */
	class Pending_Shop
	{
		private $conn;
		public $id;
		public $fname;
		public $lname;
		public $gender;
		public $phone_code;
		public $number;
		public $personal_email;
		public $sname;
		public $stype;
		public $city;
		public $province;
		public $address;
		public $postcode;
		public $phone_code2;
		public $shop_number;
		public $shop_email;

		public function __construct($db)
		{
			$this->conn = $db;
		}
		
		//CREATE NEW PENDING SHOP
		public function create_pendingShop(){
			$this->fname = htmlspecialchars(strip_tags($this->fname));
			$this->lname = htmlspecialchars(strip_tags($this->lname));
			$this->gender = htmlspecialchars(strip_tags($this->gender));
			$this->phone_code = htmlspecialchars(strip_tags($this->phone_code));
			$this->number = htmlspecialchars(strip_tags($this->number));
			$this->personal_email = htmlspecialchars(strip_tags($this->personal_email));
			$this->sname = htmlspecialchars(strip_tags($this->sname));
			$this->stype = htmlspecialchars(strip_tags($this->stype));
			$this->city = htmlspecialchars(strip_tags($this->city));
			$this->province = htmlspecialchars(strip_tags($this->province));
			$this->address = htmlspecialchars(strip_tags($this->address));
			$this->postcode = htmlspecialchars(strip_tags($this->postcode));
			$this->phone_code2 = htmlspecialchars(strip_tags($this->phone_code2));
			$this->shop_number = htmlspecialchars(strip_tags($this->shop_number));
			$this->shop_email = htmlspecialchars(strip_tags($this->shop_email));

			$sql = 'CALL create_pendingShop("'.$this->fname.'","'.$this->lname.'","'.$this->gender.'","'.$this->phone_code.'","'.$this->number.'","'.$this->personal_email.'","'.$this->sname.'","'.$this->stype.'","'.$this->city.'","'.$this->province.'","'.$this->address.'","'.$this->postcode.'","'.$this->phone_code2.'","'.$this->shop_number.'","'.$this->shop_email.'")';
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
				return false;
			}
		}

		//GET ALL PENDING SHOPS
		public function pendingShops(){
			if(isset($this->id)){
				$sql = "SELECT PENDING_SHOPS.id,PENDING_SHOPS.fname,PENDING_SHOPS.lname,PENDING_SHOPS.gender, PENDING_SHOPS.phone_code, PENDING_SHOPS.number, PENDING_SHOPS.personal_email, PENDING_SHOPS.sname, PENDING_SHOPS.stype, CITIES.name as city, PENDING_SHOPS.province, PENDING_SHOPS.address, PENDING_SHOPS.postcode, PENDING_SHOPS.phone_code2, PENDING_SHOPS.shop_number, PENDING_SHOPS.shop_email, PENDING_SHOPS.accepted FROM PENDING_SHOPS,CITIES WHERE CITIES.id = PENDING_SHOPS.city AND PENDING_SHOPS.id = ".$this->id;	
			}else{
				$sql = "SELECT PENDING_SHOPS.id,PENDING_SHOPS.fname,PENDING_SHOPS.lname,PENDING_SHOPS.gender, PENDING_SHOPS.phone_code, PENDING_SHOPS.number, PENDING_SHOPS.personal_email, PENDING_SHOPS.sname, PENDING_SHOPS.stype, CITIES.name as city, PENDING_SHOPS.province, PENDING_SHOPS.address, PENDING_SHOPS.postcode, PENDING_SHOPS.phone_code2, PENDING_SHOPS.shop_number, PENDING_SHOPS.shop_email, PENDING_SHOPS.accepted FROM PENDING_SHOPS,CITIES WHERE CITIES.id = PENDING_SHOPS.city";
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

		//GET ALL PENDING SHOPS
		public function accept_pendingShop(){
			$sql = "UPDATE PENDING_SHOPS SET accepted = 1 WHERE PENDING_SHOPS.id = ".$this->id;
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}else{
				return false;
			}
		}
	}	
?>