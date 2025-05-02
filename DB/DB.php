<?php

class DB{
    
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $databaseName = "wdt";
 
    public function DBConnect() {
        try {
            $connection = new PDO('mysql:host=' . $this->servername . ';dbname=' .           $this->databaseName, 
            $this->username, 
            $this->password);


            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $connection;
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    
}

?>