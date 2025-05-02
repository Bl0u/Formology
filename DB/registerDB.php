<?php

    require_once 'DB.php' ;
    $objDB = new DB() ;
    $conn = $objDB -> DBConnect() ;
    $method = $_SERVER['REQUEST_METHOD'];
    switch($method){
        case 'POST':
            $user = json_decode(file_get_contents('php://input')) ;
            $sql = "INSERT INTO users(user_id, full_name, email, password) 
            VALUES(:user_id, :full_name, :email, :password)" ;
            $stmt = $conn->prepare($sql) ;
            $stmt -> bindParam(':user_id', $user -> userId);
            $stmt -> bindParam(':full_name', $user -> fullName);
            $stmt -> bindParam(':email', $user -> email);
            $stmt -> bindParam(':password', $user -> pwd);
        
        
            if ($stmt->execute()){
                $response = ['status' => 1, 
                'message' => 'Record created successfully'] ;
            } else {
                $response = ['status' => 0, 'message' => 'record failed'] ;
            } ;
            break ;
        
    }
    

?>

<!-- CREATE TABLE IF NOT EXISTS `wdt`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,  -- 255 length to accommodate password hashes
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; -->