<?php

// Include the DB connection class
require_once 'DB.php';

// Initialize response array
$response = [
    "status" => "",
    "message" => "",
    "debug" => [],
    "data" => null
];

// Get current date/time and user for debugging purposes
$timestamp = date("Y-m-d H:i:s");
$user = 'Bl0u';
$response["timestamp"] = $timestamp;
$response["user"] = $user;

try {
    // Get the formId from the query parameters
    if (!isset($_GET['formId']) || empty($_GET['formId'])) {
        throw new Exception("No form ID provided in the request.");
    }

    $formId = $_GET['formId'];
    $response["debug"][] = "Form ID received: " . $formId;

    // Connect to the database
    $db = new DB();
    $conn = $db->DBConnect();
    $response["debug"][] = "Database connection established.";

    // Start building the form object
    $form = [
        "formId" => $formId,
        "sections" => []
    ];

    // Fetch the form details to ensure the form exists
    $stmtForm = $conn->prepare("SELECT form_id FROM forms WHERE form_id = :form_id");
    $stmtForm->execute([':form_id' => $formId]);

    if ($stmtForm->rowCount() === 0) {
        throw new Exception("Form not found for the given form ID.");
    }

    $response["debug"][] = "Form exists in the database.";

    // Fetch all sections for the given form ID
    $stmtSections = $conn->prepare("SELECT section_Id, title FROM sections WHERE form_id = :form_id ORDER BY display_order ASC");
    $stmtSections->execute([':form_id' => $formId]);
    $sections = $stmtSections->fetchAll(PDO::FETCH_ASSOC);

    $response["debug"][] = "Fetched " . count($sections) . " sections for the form.";

    // Iterate through each section and fetch its questions
    foreach ($sections as $section) {
        $sectionId = $section['section_Id'];
        $sectionTitle = $section['title'];

        // Fetch questions for the current section
        $stmtQuestions = $conn->prepare("SELECT question_id, question_type AS type, question, is_required, display_order FROM questions WHERE section_id = :section_id ORDER BY display_order ASC");
        $stmtQuestions->execute([':section_id' => $sectionId]);
        $questions = $stmtQuestions->fetchAll(PDO::FETCH_ASSOC);

        $response["debug"][] = "Fetched " . count($questions) . " questions for section ID: " . $sectionId;

        // Fetch values for each question (if any) and assign sectionId
        foreach ($questions as &$question) {
            $questionId = $question['question_id'];

            $stmtValues = $conn->prepare("SELECT value_text FROM question_values WHERE question_id = :question_id");
            $stmtValues->execute([':question_id' => $questionId]);
            $values = $stmtValues->fetchAll(PDO::FETCH_COLUMN);

            $question['values'] = !empty($values) ? $values : null; // Add values to the question
            $question['sectionId'] = $sectionId; // Add sectionId to the question
        }

        // Add the section and its questions to the form object
        $form['sections'][] = [
            "sectionId" => $sectionId,
            "title" => $sectionTitle,
            "questions" => $questions
        ];
    }

    $response["status"] = "success";
    $response["message"] = "Form fetched successfully.";
    $response["data"] = $form;
    http_response_code(200);

} catch (PDOException $e) {
    // Handle database-related errors
    $response["status"] = "error";
    $response["message"] = "Database error: " . $e->getMessage();
    $response["debug"][] = "SQL Error Code: " . $e->getCode();
    http_response_code(500);

} catch (Exception $e) {
    // Handle general errors
    $response["status"] = "error";
    $response["message"] = $e->getMessage();
    http_response_code(400);
}

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);

?>