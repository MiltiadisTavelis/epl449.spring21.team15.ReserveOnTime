<?php
	/**
	 * 
	 */
	use \Firebase\JWT\JWT;

	class Token
	{
		private $conn;
		public $key = 'privatekey';

		public function __construct($db)
		{
			$this->conn = $db;
		}

		public function auth(){
			$iat = time();
			$exp = $iat + 60 * 60;
			$payload = array(
				'iss' => 'http://192.168.64.2/v1/shops/all',
				'aud' => 'http://192.168.64.2/',
				'iat' => $iat,
				'exp' => $exp
			);
			$jwt = JWT::encode($payload, $this->key, 'HS512');
			return array(
				'token' => $jwt,
				'expires' => $exp
			);
		}

	}
?>