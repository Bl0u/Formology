<?php
// Include database connection class
require_once 'DB.php';

/**
 * Fetches all forms from the database, including the title of the first section in each form.
 *
 * @return array An array containing the status, message, and the list of forms with their first section titles or error details.
 */
function getAllForms() {
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

        // Query to fetch all forms along with the title of their first section
        $stmt = $conn->query("
            SELECT 
                f.form_id, 
                f.created_at, 
                s.title AS first_section_title
            FROM forms f
            LEFT JOIN sections s 
                ON f.form_id = s.form_id
            WHERE s.display_order = 1
            ORDER BY f.created_at ASC
        ");

        $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($forms) {
            $response["status"] = "success";
            $response["message"] = "Forms fetched successfully.";
            $response["data"] = $forms;
        } else {
            $response["status"] = "success";
            $response["message"] = "No forms found in the database.";
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
    // Fetch all forms
    $response = getAllForms();

    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
}
?>