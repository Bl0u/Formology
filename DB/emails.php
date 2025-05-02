<?php
// Include database connection class
require_once 'DB.php';

/**
 * Fetches all users from the database.
 *
 * @return array An array containing the status, message, and the list of users or error details.
 */
function getAllUsers() {
    $timestamp = date("Y-m-d H:i:s");

    $response = [
        "status" => "",
        "message" => "",
        "data" => [],
        "timestamp" => $timestamp
    ];

    try {
        // Connect to database
        $db = new DB();
        $conn = $db->DBConnect();

        // Query to fetch all users
        $stmt = $conn->query("SELECT user_id, email, created_at FROM users ORDER BY created_at ASC");

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($users) {
            $response["status"] = "success";
            $response["message"] = "Users fetched successfully.";
            $response["data"] = $users;
        } else {
            $response["status"] = "success";
            $response["message"] = "No users found in the database.";
        }
    } catch (PDOException $e) {
        $response["status"] = "error";
        $response["message"] = "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        $response["status"] = "error";
        $response["message"] = "Error: " . $e->getMessage();
    }

    return $response;
}

// If this script is accessed directly via HTTP
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all users
    $response = getAllUsers();

    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
}
?>