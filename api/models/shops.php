<?php
	/**
	 * 
	 */
	class Shops
	{
		private $conn;
		public $id;
		public $sname;
		public $stype;
		public $email;
		public $name;
		public $pnum;
		public $description;
		public $mngid;
		public $capacity;
		public $tables;
		public $reg_date;
		public $street;
		public $streetnum;
		public $area;
		public $sort;
		public $open;
		public $city;
		public $avg_rating;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//SHOW ALL
		public function shops(){
			$where = array();
			$sql = '
			SELECT SHOPS.id,SHOPS.sname,SHOP_TYPE.type,SHOPS.email,SHOPS.pnum,SHOPS.description,SHOPS.capacity,SHOPS.tables,SHOPS.reg_date, STREETS.street, SHOPS.streetnum, AREAS.area,CITIES.name, ADDRESS.pc, SHOPS.avg_rating 
			FROM AREAS,SHOPS,CITIES,ADDRESS,STREETS,SHOP_TYPE,SHOP_HOURS 
			WHERE SHOPS.address = ADDRESS.id
			AND ADDRESS.street = STREETS.id 
			AND ADDRESS.area = AREAS.id 
			AND ADDRESS.city = CITIES.id 
			AND SHOPS.stype = SHOP_TYPE.id
			AND SHOPS.id = SHOP_HOURS.shopid';

			$order = '';
			$open = "";
			if(isset($this->sname)){
			    $where[] = 'sname LIKE \'%'.$this->sname.'%\'';
			}
			if(isset($this->stype)){
			    $where[] = 'stype = '.$this->stype;
			}
			if(isset($this->city)){
			    $where[] = 'CITIES.id = '.$this->city;
			}

			if(isset($this->sort) && (strcasecmp($this->sort, 'oldest') == 0)){
			    $order = 'ORDER BY reg_date';
			}elseif(isset($this->sort) && (strcasecmp($this->sort, 'newest') == 0)){
			    $order = 'ORDER BY reg_date DESC';
			}elseif(isset($this->sort) && (strcasecmp($this->sort, 'rating') == 0)){
			    $order = 'ORDER BY avg_rating DESC';
			}
			// elseif(isset($sort) && (strcasecmp($sort, 'A to Z') == 0)){
			//     $where[] = 'ORDER BY sname';
			// }elseif(isset($sort) && (strcasecmp($sort, 'Z to A') == 0)){
			//     $where[] = 'ORDER BY reg_date DESC';
			// }

			if(isset($this->open) && $this->open == 1){
				$day = date('N', strtotime(date('l'))); //DAY NUMBER MON=1 .. 
				$time = gmdate("H:i:s", time()+(2*60*60)); //GMT+2 (CYPRUS)
				$where[] = 'SHOP_HOURS.day = '.$day.' AND SHOP_HOURS.open<= "'.$time.'" AND SHOP_HOURS.close>= "'.$time.'"';
			}

			$where_string = implode(' AND ' , $where);

			if($where){
				$sql .= ' AND ' . $where_string;
			}
			if(isset($this->sort)){
				$sql .= ' '.$order;
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

		//SHOW SHOP BY ID
		public function shop(){
			$sql = '
			SELECT SHOPS.id,SHOPS.sname,SHOP_TYPE.type,SHOPS.email,SHOPS.pnum,SHOPS.description,SHOPS.capacity,SHOPS.tables,SHOPS.reg_date, STREETS.street, SHOPS.streetnum, AREAS.area,CITIES.name, ADDRESS.pc, SHOPS.avg_rating  
			FROM AREAS,SHOPS,CITIES,ADDRESS,STREETS,SHOP_TYPE,SHOP_HOURS 
			WHERE SHOPS.address = ADDRESS.id 
			AND ADDRESS.street = STREETS.id 
			AND ADDRESS.area = AREAS.id 
			AND ADDRESS.city = CITIES.id 
			AND SHOPS.stype = SHOP_TYPE.id 
			AND SHOPS.id = SHOP_HOURS.shopid
			AND SHOPS.id = ?';
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->sname = $row["sname"];
            $this->stype = $row["type"];
            $this->email = $row["email"];
            $this->pnum = $row["pnum"];
            $this->description = $row["description"];
            $this->capacity = $row["capacity"];
            $this->tables = $row["tables"];
            $this->reg_date = $row["reg_date"];
            $this->street = $row["street"];
            $this->streetnum = $row["streetnum"];
            $this->area = $row["area"];
            $this->city = $row["name"];
            $this->pc = $row["pc"];
            $this->avg_rating = $row["avg_rating"];
		}

		//UPDATE SHOP DETAILS BY ID
		public function update_shop(){
			$sql = 'UPDATE SHOPS SET
							sname = ?,
							stype = ?,
							email = ?,
							pnum = ?,
							description = ?,
							capacity = ?,
							tables = ?
							WHERE id=?';
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			$this->sname = htmlspecialchars(strip_tags($this->sname));
			$this->stype = htmlspecialchars(strip_tags($this->stype));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));
			$this->description = htmlspecialchars(strip_tags($this->description));
			$this->capacity = htmlspecialchars(strip_tags($this->capacity));
			$this->tables = htmlspecialchars(strip_tags($this->tables));
			
			$stmt->bind_param('sssssiii',
									$this->sname,
									$this->stype,
									$this->email,
									$this->pnum,
									$this->description,
									$this->capacity,
									$this->tables,
									$this->id
							);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//CREATE NEW SHOP
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