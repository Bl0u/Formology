<?php

// Include the DB connection class
require_once 'DB.php';

// Initialize response array
$response = [
    "status" => "",
    "message" => "",
    "debug" => []
];

// Get current date/time
$timestamp = date("Y-m-d H:i:s");
$response["timestamp"] = $timestamp;

try {
    // Get raw JSON input
    $rawInput = file_get_contents('php://input');

    // Debug info
    $response["debug"][] = "Raw input length: " . strlen($rawInput);

    // Check if input is empty
    if (empty($rawInput)) {
        throw new Exception("No data received. The request body is empty.");
    }

    // Decode JSON input
    $data = json_decode($rawInput, true);

    // Check for JSON errors
    if ($data === null) {
        $jsonError = json_last_error();
        $jsonErrorMsg = json_last_error_msg();
        throw new Exception("Invalid JSON data: " . $jsonErrorMsg);
    }

    // Debug decoded data
    $response["debug"][] = "Decoded data keys: " . json_encode(array_keys($data));

    // Extract the `params` object if it exists
    if (!isset($data['params'])) {
        throw new Exception("Invalid data format. Expected 'params' field.");
    }

    $params = $data['params'];

    // Validate required fields inside `params`
    if (!isset($params['form']) || !isset($params['emailLogged'])) {
        throw new Exception("Invalid data format. Expected 'form' and 'emailLogged' fields inside 'params'.");
    }

    $form = $params['form'];
    $email = $params['emailLogged'];

    // Validate required fields inside `form`
    if (!isset($form['formId']) || !isset($form['sections']) || !is_array($form['sections'])) {
        throw new Exception("Invalid data format. Expected 'formId' and 'sections' fields inside 'form'.");
    }

    $formId = $form['formId'];
    $sections = $form['sections'];

    // Connect to the database
    $db = new DB();
    $conn = $db->DBConnect();

    // Begin transaction
    $conn->beginTransaction();

    // Check if the user exists in the `users` table
    $stmtUser = $conn->prepare("SELECT user_id FROM users WHERE email = :email");
    $stmtUser->execute([':email' => $email]);
    $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        // If the user does not exist, insert them
        $stmtInsertUser = $conn->prepare("INSERT INTO users (email, created_at) VALUES (:email, :created_at)");
        $stmtInsertUser->execute([
            ':email' => $email,
            ':created_at' => $timestamp
        ]);
        $userId = $conn->lastInsertId();
        $response["debug"][] = "New user created with ID: " . $userId;
    } else {
        $userId = $user['user_id'];
        $response["debug"][] = "Existing user found with ID: " . $userId;
    }

    // Insert a new response into the `responses` table
    $stmtResponse = $conn->prepare("INSERT INTO responses (form_id, user_id, submitted_at) VALUES (:form_id, :user_id, :submitted_at)");
    $stmtResponse->execute([
        ':form_id' => $formId,
        ':user_id' => $userId,
        ':submitted_at' => $timestamp
    ]);

    // Get the response ID
    $responseId = $conn->lastInsertId();
    $response["debug"][] = "Generated response ID: " . $responseId;

    // Prepare the statement for inserting answers
    $stmtAnswer = $conn->prepare("INSERT INTO answers (response_id, question_id, section_id, answer_text) VALUES (:response_id, :question_id, :section_id, :answer_text)");

    // Process sections and questions
    $totalAnswers = 0;
    foreach ($sections as $section) {
        if (!isset($section['sectionId']) || !isset($section['questions']) || !is_array($section['questions'])) {
            $response["debug"][] = "Skipping invalid section: " . json_encode($section);
            continue;
        }

        $sectionId = $section['sectionId'];
        foreach ($section['questions'] as $question) {
            if (!isset($question['question_id']) || !isset($question['answer'])) {
                $response["debug"][] = "Skipping invalid question: " . json_encode($question);
                continue;
            }

            $questionId = $question['question_id'];
            $answer = $question['answer'];

            // Handle cases where the answer is an array (e.g., multi-select answers)
            if (is_array($answer)) {
                $answer = json_encode($answer); // Convert array to JSON string
            }

            // Insert the answer into the `answers` table
            $stmtAnswer->execute([
                ':response_id' => $responseId,
                ':question_id' => $questionId,
                ':section_id' => $sectionId,
                ':answer_text' => $answer
            ]);
            $totalAnswers++;
        }
    }

    // Commit transaction
    $conn->commit();

    $response["status"] = "success";
    $response["message"] = "Form responses saved successfully.";
    $response["debug"][] = "Total answers saved: " . $totalAnswers;
    http_response_code(200);

} catch (PDOException $e) {
    // Rollback transaction on error
    if (isset($conn)) {
        $conn->rollBack();
    }

    $response["status"] = "error";
    $response["message"] = "Database error: " . $e->getMessage();
    $response["debug"][] = "SQL Error Code: " . $e->getCode();
    http_response_code(500);

} catch (Exception $e) {
    $response["status"] = "error";
    $response["message"] = $e->getMessage();
    http_response_code(400);
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);

?>