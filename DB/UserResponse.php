<?php
// Include database connection class
require_once 'DB.php';

/**
 * Fetches user answers for a given email and form ID.
 *
 * @param string $email The email of the user.
 * @param string $formId The ID of the form.
 * @return array An array containing the status, message, and user answers or error details.
 */
function getUserAnswers($email, $formId) {
    $timestamp = date("Y-m-d H:i:s");
    $response = [
        "status" => "",
        "message" => "",
        "data" => [],
        "timestamp" => $timestamp
    ];

    try {
        // Connect to the database
        $db = new DB();
        $conn = $db->DBConnect();

        // Log input parameters
        error_log("Fetching answers for email: $email and formId: $formId");

        // Query to fetch user answers
        $stmt = $conn->prepare("
            SELECT 
                q.question, 
                a.answer_text, 
                q.display_order 
            FROM users u
            JOIN responses r ON u.user_id = r.user_id
            JOIN answers a ON r.response_id = a.response_id
            JOIN questions q ON a.question_id = q.question_id
            WHERE 
                u.email = :email 
                AND r.form_id = :form_id
            ORDER BY q.display_order
        ");

        $stmt->execute([':email' => $email, ':form_id' => $formId]);

        $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($answers) {
            error_log("Answers found: " . json_encode($answers));
            $response["status"] = "success";
            $response["message"] = "User answers fetched successfully.";
            $response["data"] = $answers;
        } else {
            error_log("No answers found for email: $email and formId: $formId");
            $response["status"] = "success";
            $response["message"] = "No answers found for the given email and form ID.";
            $response["data"] = [];
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        $response["status"] = "error";
        $response["message"] = "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        $response["status"] = "error";
        $response["message"] = "Error: " . $e->getMessage();
    }

    return $response;
}

// If this script is accessed directly via HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the raw POST body and decode it as JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Log the raw payload
    error_log("Raw input: " . $input);

    // Retrieve email and formId from the JSON payload
    $email = $data['email'] ?? null;
    $formId = $data['formId'] ?? null;

    // Validate input
    if (!$email || !$formId) {
        error_log("Missing required parameters: email and/or form_id.");
        // Missing required parameters
        $response = [
            "status" => "error",
            "message" => "Missing required parameters: email and/or form_id.",
            "timestamp" => date("Y-m-d H:i:s")
        ];
    } else {
        // Fetch user answers
        $response = getUserAnswers($email, $formId);
    }

    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
}
?>