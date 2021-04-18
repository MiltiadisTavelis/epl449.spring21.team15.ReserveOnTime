<?php
	/**
	 * 
	 */
	class Users
	{
		private $conn;
		public $id;
		public $fname;
		public $lname;
		public $birth;
		public $gender;
		public $phone_code;
		public $pnum;
		public $email;
		public $usertype;
		public $password;
		public $verify;
		public $url;
		public $shop_id;
		public $page_type;
		public $data;

		public function __construct($db)
		{
			$this->conn = $db;
		}

		//GET USER DETAILS BY ID
		public function user(){
			$sql = "SELECT id,fname,lname,phone_code,pnum,email,usertype,verify,gender,birth FROM USERS WHERE id = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
			$this->data = $row;
            $this->fname = $row["fname"];
            $this->lname = $row["lname"];
            $this->phone_code = $row["phone_code"];
            $this->pnum = $row["pnum"];
            $this->birth = $row["birth"];
            $this->email = $row["email"];
            $this->usertype = $row["usertype"];
            $this->verify = $row["verify"];
            $this->gender = $row["gender"];
		}

		//GET USER DETAILS BY ID
		public function shop(){
			$sql = "SELECT id FROM SHOPS WHERE mngid = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->shop_id = $row["id"];
		}

		//GET USER DETAILS BY ID
		public function name(){
			$sql = 'SELECT fname,lname FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('s',$this->email);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->fname = $row["fname"];
            $this->lname = $row["lname"];
            return $this->fname.' '.$this->lname;
		}

		//GET USER ID BY EMAIL (helper method)
		private function getid($s){
			$sql = 'SELECT USERS.id FROM USERS WHERE email = "'.$s.'"';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				$row = $stmt->get_result();
				$row = $row->fetch_array(MYSQLI_ASSOC);
				return $row['id'];
			}else{
				return "";
			}
		}

		//CREATE NEW USER
		public function create_user(){
			$sql = 'INSERT INTO USERS (
							fname,
							lname,
							birth,
							gender,
							phone_code,
							pnum,
							email,
							password,
							usertype) VALUES (?,?,?,?,?,?,?,?,?)';
			$stmt = $this->conn->prepare($sql);
			$this->fname = htmlspecialchars(strip_tags($this->fname));
			$this->lname = htmlspecialchars(strip_tags($this->lname));
			$this->birth = htmlspecialchars(strip_tags($this->birth));
			$this->gender = htmlspecialchars(strip_tags($this->gender));
			$this->phone_code = htmlspecialchars(strip_tags($this->phone_code));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));
			$this->email = htmlspecialchars(strip_tags($this->email));
			$this->password = htmlspecialchars(strip_tags($this->password));
			$this->password = hash("sha256", $this->password);
			$this->usertype = 'u';

			$stmt->bind_param('sssssssss',
										$this->fname,
										$this->lname,
										$this->birth,
										$this->gender,
										$this->phone_code,
										$this->pnum,
										$this->email,
										$this->password,
										$this->usertype);


			if($stmt->execute()){
				$id = '"'.$this->getid($this->email).'"';
				$hash = md5(rand(0,1000));
				$sql = 'INSERT INTO PENDING_USER SET user_id = '.$id.', code = "'.$hash.'"';
				$stmt = $this->conn->prepare($sql);

				if(!$stmt->execute()){
					printf("Verify Error: %s.\n",$stmt->error);
					return false;
				}

				$results = $this->geturl($this->email);
				if(!empty($results)){
					return $results;
				}else{
					printf("Verify Error: %s.\n",$stmt->error);
					return false;
				}
			}

			printf("User Error: %s.\n",$stmt->error);

			return false;
		}

		//UPDATE USER DETAILS BY ID
		public function update_user(){
			$sql = 'UPDATE USERS SET
							fname = ?,
							lname = ?,
							phone_code = ?,
							pnum = ?,
							gender = ?,
							birth = ?
							WHERE id=?';
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			$this->fname = htmlspecialchars(strip_tags($this->fname));
			$this->lname = htmlspecialchars(strip_tags($this->lname));
			$this->phone_code = htmlspecialchars(strip_tags($this->phone_code));
			$this->pnum = htmlspecialchars(strip_tags($this->pnum));
			$this->gender = htmlspecialchars(strip_tags($this->gender));
			$this->birth = htmlspecialchars(strip_tags($this->birth));
			$stmt->bind_param('ssssssi',
										$this->fname,
										$this->lname,
										$this->phone_code,
										$this->pnum,
										$this->gender,
										$this->birth,
										$this->id);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}

		//DELETE USER BY ID
		public function delete_user(){
			$sql = 'DELETE FROM USERS WHERE id=?';
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			$stmt->bind_param('i',$this->id);

			if($stmt->execute()){
				return true;
			}

			printf("Error: %s.\n",$stmt->error);

			return false;
		}


		//GET URL FOR VERIFICATION
		public function geturl($e){
			if(!$this->exist($e)){
				return 3; 
			}

			$result = $this->isverified($e);

			if($result == true){
            	return 0;
            }

            $hash = $this->getidhash($this->getid($e));

			if(!empty($hash)){
				return 'reserveontime.com/api/v1/verify?hash='.$hash.'&email='.$e;
			}else{
				return "";
			}
		}

		//GET URL FOR PASSWORD RESET
		public function getpassurl($e){
			if(!$this->exist($e)){
				return 3; 
			}
            $hash = $this->getidpasshash($e);
			if(!empty($hash)){
				return 'https://reserveontime.com/passreset.html?hash='.$hash.'&email='.$e;
			}else{
				return "";
			}
		}

		//GET USER HASH BY ID (helper method)
		private function getidpasshash($e){
			$hash = md5(rand(0,1000));
			$sql = 'INSERT INTO PRESET SET user_email = "'.$e.'", code = "'.$hash.'"';
			$stmt = $this->conn->prepare($sql);
			if(!$stmt->execute()){
				printf("Password Reset Error: %s.\n",$stmt->error);
				return false;
			}
			return $hash;
		}

		//VERIFY USER
		public function verify_user(){
			//Check if user exist
			if(!$this->exist($this->email)){
				return 3; 
			}

			//Check if he is already verified
			if($this->isverified($this->email)){
            	return 0;
            }

            //Get the id by email
			$this->id = $this->getid($this->email);

			//If is empty something went wrong so return 3
            if(empty($this->id)){
            	return 3;
            }

            //Else get the hash
            $hash = $this->getidhash($this->id);

            //And if it matches with the one he provides
            if(strcmp($hash, $this->hash)){
            	return 3;
            }

            //Then authorize the account by deleting the hash from pending users
            if($this->delete_hash($this->id) == false){
            	return -1;
            }

            //And verify the account
            if($this->verify($this->id) == false){
            	return -1;
            }
            return 1;
		}

		//CHECK IF A USER IS VERIFIED (INPUT: EMAIL) (helper method)
		private function isverified($e){
			$sql = 'SELECT verify FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$e = htmlspecialchars(strip_tags($e));
			$stmt->bind_param('s',$e);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->verify = $row["verify"];

            if($this->verify == 1){
            	return true;
            }elseif($this->verify == 0){
            	return false;
            }else{
            	printf("User Error: %s.\n",$stmt->error);
            	return;
            }
            
		}

		//CHECK IF A USER EXIST (INPUT: EMAIL)
		public function exist($e){
			$sql = 'SELECT id FROM USERS WHERE email = ?';
			$stmt = $this->conn->prepare($sql);
			$e = htmlspecialchars(strip_tags($e));
			$stmt->bind_param('s',$e);
			$stmt->execute();
			$row = $stmt->get_result();
			$row = $row->fetch_array(MYSQLI_ASSOC);
            $this->id = $row["id"];
            if(!empty($this->id)){
            	return true;
            }else{
            	return false;
            }
            
		}

		//GET USER HASH BY ID (helper method)
		private function getidhash($s){
			$sql = 'SELECT code FROM PENDING_USER WHERE user_id = "'.$s.'"';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				$row = $stmt->get_result();
				$row = $row->fetch_array(MYSQLI_ASSOC);
				return $row['code'];
			}else{
				return "";
			}
		}

		//VERIFY HASH (PASSRESET)
		public function verifyhash($e,$h){
			$sql = 'SELECT code FROM PRESET WHERE user_email = "'.$e.'"';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				$row = $stmt->get_result();
				$row = $row->fetch_array(MYSQLI_ASSOC);
				if(strcmp($row['code'],$h) == 0){
					return "1";
				}else{
					return "0";
				}
			}else{
				return "";
			}
		}

		//CHANGE PASSWORD (PASSRESET)
		public function newpass($e,$p,$h){
			if($this->verifyhash($e,$h) == "1"){
				$pass = htmlspecialchars(strip_tags($p));
				$pass = hash("sha256", $p);
				$sql = 'UPDATE USERS SET USERS.password = "'.$pass.'" WHERE USERS.email = "'.$e.'"';
				$stmt = $this->conn->prepare($sql);
				if($stmt->execute()){
					$sql = 'DELETE FROM PRESET WHERE user_email = "'.$e.'"';
					$stmt = $this->conn->prepare($sql);
					$stmt->execute();
					return "1";
				}else{
					return "0";
				}
			}else{
				return "0";
			}
		}

		//CHECK IF EMAIL EXIST IN PASS RESET
		public function passrescheck($e){
			$sql = 'SELECT * FROM PRESET WHERE user_email = "'.$e.'"';
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				$result = $stmt->get_result();
				$count = mysqli_num_rows($result);
				if($count == "0"){
					return true;
				}else{
					$row = $result->fetch_array(MYSQLI_ASSOC);
					$this->url = 'https://reserveontime.com/passreset.html?hash='.$row['code'].'&email='.$e;
					return false;
				}
			}else{
				return "";
			}
		}

		//DELETE PENDING USER BY ID (helper method)
		private function delete_hash($id){
			$sql = 'DELETE FROM PENDING_USER WHERE user_id = '.$id;
			$stmt = $this->conn->prepare($sql);
			$this->id = htmlspecialchars(strip_tags($this->id));
			if($stmt->execute()){
			 	return true;
			}
			printf("Error: %s.\n",$stmt->error);
			return false;
		}

		//VERIFY USER verify = 1 (helper method)
		private function verify($id){
			$sql = 'UPDATE USERS SET verify = 1 WHERE USERS.id = '.$id;
			$stmt = $this->conn->prepare($sql);
			if($stmt->execute()){
				return true;
			}else{
				printf("Error: %s.\n",$stmt->error);
				return false;
			}
		}

		//DOWNLOAD USER DATA
		public function download_data(){
			$this->user();
			$json['Data'] = array(["User_ID","First_Name","Last_Name","Phone_Code","Phone_#","Email","User_Type","Verify","Gender","Birthday"],$this->data);
			$res = $this->getReservations();
			if(isset($res[0])){
				$array = array(["Day/Time","Num_of_People","Shop_Name","Status"]);
				foreach($res as $input){
					array_push($array, $input);
				}
				$json['Reservations'] = $array;
			}

			$reviews = $this->getReviews();
			if(isset($reviews[0])){
				$array = array(["Shop_Name","Content","Rating","Submitted"]);
				foreach($reviews as $input){
					array_push($array, $input);
				}
				$json['Reviews'] = $array;
			}

			if($this->page_type == "m"){
			}

			date_default_timezone_set('Europe/Athens');
			$now = new DateTime("now", new DateTimeZone('Europe/Athens'));
			$day = $now->format('Ymd');
			$time = $now->format('His');

			$folder = '../../data/'.$this->id."/";

			if (!file_exists($folder)) {
    			mkdir($folder, 0777, true);
			}else{
				$files = glob($folder.'*'); 
				foreach($files as $file) {
				    if(is_file($file)) 
				        unlink($file); 
				}
			}

			$url1 = $folder.$day."_".$time."_userData.csv";
			$url2 = $folder.$day."_".$time."_reservationData.csv";
			$url3 = $folder.$day."_".$time."_reviewsData.csv";

			$this->array_to_csv_download($json['Data'],$url1);
			$this->array_to_csv_download($json['Reservations'],$url2);
			$this->array_to_csv_download($json['Reviews'],$url3);

			$rootPath = realpath($folder);
			$zip = new ZipArchive();
			$zip->open($folder.'data.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);
			$files = new RecursiveIteratorIterator(
			    new RecursiveDirectoryIterator($rootPath),
			    RecursiveIteratorIterator::LEAVES_ONLY
			);
			$filesToDelete = array();
			foreach ($files as $name => $file){
			    if (!$file->isDir()){
			        $filePath = $file->getRealPath();
			        $relativePath = substr($filePath, strlen($rootPath) + 1);
			        $zip->addFile($filePath, $relativePath);
			        $filesToDelete[] = $filePath;
			    }
			}
			$zip->close();
			chmod($folder."data.zip", 0777);

			foreach ($filesToDelete as $file){
			    unlink($file);
			}
			
			$file = $folder."data.zip";

			if (file_exists($file)) {
			    header('Content-Description: File Transfer');
			    header('Content-Type: application/octet-stream');
			    header('Content-Disposition: attachment; filename="'.basename($file).'"');
			    header('Expires: 0');
			    header('Cache-Control: must-revalidate');
			    header('Pragma: public');
			    header('Content-Length: ' . filesize($file));
			    readfile($file);
			    exit;
			}

			return false;
		}

		private function array_to_csv_download($array,$file) {
			$output = fopen($file, "wb");
		  	foreach ($array as $row){
		   		fputcsv($output, $row, ";");
		  	}
		  	fclose($output);
		} 

		private function getReservations(){
			$sql = "SELECT RESERVATIONS.day,RESERVATIONS.people,SHOPS.sname,STATUS.status FROM RESERVATIONS,SHOPS,STATUS WHERE RESERVATIONS.shopid = SHOPS.id AND RESERVATIONS.status = STATUS.sid AND RESERVATIONS.userid = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$res = $stmt->get_result();
			$ret = array();
			while($row = $res->fetch_array(MYSQLI_ASSOC)){
				array_push($ret, $row);
			}
			return $ret;
		}

		private function getReviews(){
			$sql = "SELECT SHOPS.sname,REVIEWS.content, REVIEWS.rating, REVIEWS.sub_date FROM REVIEWS,SHOPS WHERE REVIEWS.shop_id = SHOPS.id AND REVIEWS.uid = ?";
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param('i',$this->id);
			$stmt->execute();
			$res = $stmt->get_result();
			$ret = array();
			while($row = $res->fetch_array(MYSQLI_ASSOC)){
				array_push($ret, $row);
			}
			return $ret;
		}

	}
?>