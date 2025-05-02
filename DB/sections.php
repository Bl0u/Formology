<?php

// Get current date/time and user
$timestamp = date("Y-m-d H:i:s");
$user = 'Bl0u';

// Initialize response array
$response = [
    "status" => "",
    "message" => "",
    "debug" => [],
    "timestamp" => $timestamp,
    "user" => $user
];

try {
    // Get raw input
    $rawInput = file_get_contents('php://input');
    
    // Debug info
    $response["debug"][] = "Raw input length: " . strlen($rawInput);
    $response["debug"][] = "Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not provided');
    
    // Check if empty
    if (empty($rawInput)) {
        throw new Exception("No data received. The request body is empty.");
    }
    
    // Log a sample of the raw input
    $response["debug"][] = "Raw input sample: " . substr($rawInput, 0, 200);
    
    // Decode JSON
    $data = json_decode($rawInput, true);
    
    // Check for JSON errors
    if ($data === null) {
        $jsonError = json_last_error();
        $jsonErrorMsg = json_last_error_msg();
        $response["debug"][] = "JSON Error Code: " . $jsonError;
        $response["debug"][] = "JSON Error Message: " . $jsonErrorMsg;
        throw new Exception("Invalid JSON data: " . $jsonErrorMsg);
    }
    
    // Debug the decoded data type
    $dataType = gettype($data);
    $response["debug"][] = "Decoded data type: " . $dataType;

    // Validate required fields in the form object
    if (!isset($data['formId']) || !isset($data['sections']) || !is_array($data['sections'])) {
        throw new Exception("Invalid data format. Expected a form object with 'formId' and 'sections'.");
    }

    $form_id = $data['formId'];
    $sections = $data['sections'];
    $response["debug"][] = "Received form with ID " . $form_id . " containing " . count($sections) . " sections";

    // Connect to database
    require_once 'DB.php';
    $db = new DB();
    $conn = $db->DBConnect();
    $response["debug"][] = "Database connection established.";
    
    try {
        // Begin transaction for safety
        $conn->beginTransaction();

        // Check if the form already exists in the database
        $checkForm = $conn->prepare("SELECT form_id FROM forms WHERE form_id = :form_id");
        $checkForm->execute([':form_id' => $form_id]);
        
        if ($checkForm->rowCount() === 0) {
            // Form doesn't exist, create it
            $stmtForm = $conn->prepare("INSERT INTO forms 
                            (form_id, status, created_at, created_by) 
                            VALUES (:form_id, :status, :created_at, :created_by)");
            
            $stmtForm->execute([
                ':form_id' => $form_id,
                ':status' => 'active',
                ':created_at' => $timestamp,
                ':created_by' => $user
            ]);
            
            $response["debug"][] = "Created new form with ID: " . $form_id;
        } else {
            $response["debug"][] = "Using existing form with ID: " . $form_id;
        }
        
        // Process all sections
        $totalSections = 0;
        $totalQuestions = 0;
        $totalValues = 0;
        
        // Prepare statements outside the loop for efficiency
        $stmtSection = $conn->prepare("INSERT INTO sections 
                              (section_Id, form_id, title, display_order, created_at, created_by) 
                              VALUES (:section_Id, :form_id, :title, :display_order, :created_at, :created_by)");
        
        $stmtQuestion = $conn->prepare("INSERT INTO questions 
                              (section_id, question_id, question_type, question, is_required, display_order, created_at, created_by) 
                              VALUES (:section_id, :question_id, :question_type, :question, :is_required, :display_order, :created_at, :created_by)");
        
        $stmtValues = $conn->prepare("INSERT INTO question_values 
                             (question_id, value_text, created_by, created_at) 
                             VALUES (:question_id, :value_text, :created_by, :created_at)");
        
        foreach ($sections as $sectionIndex => $section) {
            if (!isset($section['sectionId']) || !isset($section['title'])) {
                $response["debug"][] = "Skipping section with missing sectionId or title: " . json_encode(array_keys($section));
                continue;
            }
            
            // Insert section
            $stmtSection->execute([
                ':section_Id' => $section['sectionId'],
                ':form_id' => $form_id,
                ':title' => $section['title'],
                ':display_order' => $sectionIndex + 1,
                ':created_at' => $timestamp,
                ':created_by' => $user
            ]);
            
            $totalSections++;
            $response["debug"][] = "Inserted section ID: " . $section['sectionId'];
            
            // Process questions for this section
            if (isset($section['questions']) && is_array($section['questions'])) {
                foreach ($section['questions'] as $questionIndex => $question) {
                    // Validate question data
                    if (!isset($question['questionId']) || !isset($question['type']) || !isset($question['question'])) {
                        $response["debug"][] = "Skipping question with missing required fields";
                        continue;
                    }
                    
                    // Set is_required (defaulting to 0/false)
                    $isRequired = isset($question['isRequired']) ? ($question['isRequired'] ? 1 : 0) : 0;
                    
                    // Insert question
                    $stmtQuestion->execute([
                        ':section_id' => $section['sectionId'],
                        ':question_id' => $question['questionId'],
                        ':question_type' => $question['type'],
                        ':question' => $question['question'],
                        ':is_required' => $isRequired,
                        ':display_order' => $questionIndex + 1,
                        ':created_at' => $timestamp,
                        ':created_by' => $user
                    ]);
                    
                    $totalQuestions++;
                    
                    // Insert values if they exist
                    if (isset($question['values']) && is_array($question['values'])) {
                        foreach ($question['values'] as $valueText) {
                            if ($valueText !== null && $valueText !== "") {
                                $stmtValues->execute([
                                    ':question_id' => $question['questionId'],
                                    ':value_text' => $valueText,
                                    ':created_by' => $user,
                                    ':created_at' => $timestamp
                                ]);
                                $totalValues++;
                            }
                        }
                    }
                }
            }
        }
        
        // Form statistics for response
        $response["debug"][] = "Total sections inserted: $totalSections";
        $response["debug"][] = "Total questions inserted: $totalQuestions";
        $response["debug"][] = "Total values inserted: $totalValues";
        
        // Commit transaction
        $conn->commit();
        
        $response["status"] = "success";
        $response["message"] = "Form saved successfully with $totalSections sections";
        $response["data"] = [
            "formId" => $form_id,
            "sectionCount" => $totalSections,
            "questionCount" => $totalQuestions,
            "valuesCount" => $totalValues
        ];
        http_response_code(200);
        
    } catch (PDOException $e) {
        // Rollback on error
        $conn->rollBack();
        throw $e;
    }
    
} catch (PDOException $e) {
    $response["status"] = "error";
    $response["message"] = "Database error: " . $e->getMessage();
    $response["debug"][] = "SQL Error: " . $e->getCode();
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