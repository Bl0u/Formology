<?php
// Include database connection class
require_once 'DB.php';

/**
 * Handles requests to fetch responses for a given form ID and optionally for a specific email.
 *
 * @param string $formId The ID of the form.
 * @param string|null $email (Optional) The email of the user for which responses are requested.
 * @return array An array containing the status, message, and fetched data or error details.
 */
function handleDashboardRequest($formId, $email = null) {
    $timestamp = date("Y-m-d H:i:s");
    $response = [
        "status" => "",
        "message" => "",
        "data" => [],
        "timestamp" => $timestamp,
        "formId" => $formId,
    ];

    try {
        // Connect to the database
        $db = new DB();
        $conn = $db->DBConnect();

        if ($email === null) {
            // Fetch all emails of users who submitted responses for the given form ID
            $stmt = $conn->prepare("
                SELECT DISTINCT u.email
                FROM responses r
                INNER JOIN users u ON r.user_id = u.user_id
                WHERE r.form_id = :formId
            ");
            $stmt->execute([':formId' => $formId]);

            $emails = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if ($emails) {
                $response["status"] = "success";
                $response["message"] = "Emails fetched successfully.";
                $response["data"] = $emails;
            } else {
                $response["status"] = "success";
                $response["message"] = "No responses found for the given form ID.";
                $response["data"] = [];
            }
        } else {
            // Fetch response details for the given form ID and email
            $stmt = $conn->prepare("
                SELECT 
                    q.question_id,
                    q.question,
                    q.question_type,
                    a.answer_text,
                    r.submitted_at
                FROM responses r
                INNER JOIN answers a ON r.response_id = a.response_id
                INNER JOIN questions q ON a.question_id = q.question_id
                INNER JOIN users u ON r.user_id = u.user_id
                WHERE r.form_id = :formId AND u.email = :email
                ORDER BY q.display_order ASC
            ");
            $stmt->execute([
                ':formId' => $formId,
                ':email' => $email
            ]);

            $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($responses) {
                $response["status"] = "success";
                $response["message"] = "Responses fetched successfully.";
                $response["data"] = $responses;
            } else {
                $response["status"] = "success";
                $response["message"] = "No responses found for the given form ID and email.";
                $response["data"] = [];
            }
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
    // Retrieve formId and email from query parameters
    $formId = $_GET['formId'] ?? null;
    $email = $_GET['email'] ?? null;

    // Validate input
    if (!$formId) {
        // Missing formId
        $response = [
            "status" => "error",
            "message" => "Missing required parameter: formId.",
            "timestamp" => date("Y-m-d H:i:s")
        ];
    } else {
        // Handle the request
        $response = handleDashboardRequest($formId, $email);
    }

    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
}
?>