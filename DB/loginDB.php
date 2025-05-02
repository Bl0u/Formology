<?php
require_once('DB.php');
$obj = new DB();
$conn = $obj->DBConnect();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        if (isset($_GET['email']) && isset($_GET['pwd'])) { 
            $email = $_GET['email'];
            $password = $_GET['pwd']; // <- receive password from GET
            // echo $password ;
            // Secure SQL query
            $sql = "SELECT email, password FROM users WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC); // still array here
            // echo $result['password'] ;
            if ($result) {
                // Check password
                if ($result['email'] === $email && $result['password'] === $password) {
                    echo json_encode(['exists' => true]);
                } else {
                    echo json_encode(['exists' => false]);
                }
            } else {
                echo json_encode(['exists' => false]); // no user found
            }
        } else {
            echo json_encode(['error' => 'Email and password must be provided']);
        }
        break;
}
?>
