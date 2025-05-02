<?php
// Database cleanup utility
// Current Date: 2025-04-05 22:12:11
// User: Bl0u

// Include DB connection class
require_once 'DB.php';

/**
 * Cleans all tables in the wdt database
 * 
 * @return array Array containing status, message and details about the operation
 */
function cleanupDatabase() {
    $timestamp = date("Y-m-d H:i:s");
    $user = 'Bl0u';
    
    $response = [
        "status" => "",
        "message" => "",
        "details" => [],
        "timestamp" => $timestamp,
        "user" => $user
    ];
    
    $conn = null;
    $transactionActive = false;
    
    try {
        // Connect to database
        $db = new DB();
        $conn = $db->DBConnect();
        
        $response["details"][] = "Database connection established.";
        
        // Start transaction
        $conn->beginTransaction();
        $transactionActive = true;
        $response["details"][] = "Transaction started.";
        
        // Temporarily disable foreign key checks
        $conn->exec('SET FOREIGN_KEY_CHECKS = 0');
        $response["details"][] = "Foreign key checks disabled.";
        
        // Get all tables in the database
        $stmt = $conn->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (empty($tables)) {
            $response["details"][] = "No tables found in database.";
        } else {
            $response["details"][] = "Found " . count($tables) . " tables.";
            
            // Track successful and failed tables
            $successCount = 0;
            $failedTables = [];
            
            // Truncate each table
            foreach ($tables as $table) {
                try {
                    $conn->exec("TRUNCATE TABLE `$table`");
                    $response["details"][] = "Table '$table' truncated successfully.";
                    $successCount++;
                } catch (PDOException $tableEx) {
                    $failedTables[] = [
                        "table" => $table,
                        "error" => $tableEx->getMessage()
                    ];
                    $response["details"][] = "Failed to truncate table '$table': " . $tableEx->getMessage();
                }
            }
            
            $response["details"][] = "Successfully truncated $successCount out of " . count($tables) . " tables.";
            
            if (!empty($failedTables)) {
                $response["details"][] = "Failed to truncate " . count($failedTables) . " tables.";
                $response["failed_tables"] = $failedTables;
            }
        }
        
        // Re-enable foreign key checks
        $conn->exec('SET FOREIGN_KEY_CHECKS = 1');
        $response["details"][] = "Foreign key checks re-enabled.";
        
        // Commit changes
        $conn->commit();
        $transactionActive = false;
        $response["details"][] = "Transaction committed.";
        
        $response["status"] = "success";
        $response["message"] = "Database cleanup completed successfully.";
        
    } catch (PDOException $e) {
        // If an error occurred and we have an active transaction, roll back changes
        if ($conn && $transactionActive) {
            try {
                $conn->rollBack();
                $response["details"][] = "Transaction rolled back.";
            } catch (PDOException $rollbackEx) {
                $response["details"][] = "Failed to roll back transaction: " . $rollbackEx->getMessage();
            }
            
            // Re-enable foreign key checks in case of error
            try {
                $conn->exec('SET FOREIGN_KEY_CHECKS = 1');
                $response["details"][] = "Foreign key checks re-enabled after error.";
            } catch (PDOException $fkEx) {
                $response["details"][] = "Failed to re-enable foreign key checks: " . $fkEx->getMessage();
            }
        }
        
        $response["status"] = "error";
        $response["message"] = "Database error: " . $e->getMessage();
        $response["details"][] = "SQL Error Code: " . $e->getCode();
    } catch (Exception $e) {
        // Handle any other exceptions
        if ($conn && $transactionActive) {
            try {
                $conn->rollBack();
                $response["details"][] = "Transaction rolled back due to general error.";
            } catch (PDOException $rollbackEx) {
                $response["details"][] = "Failed to roll back transaction: " . $rollbackEx->getMessage();
            }
        }
        
        $response["status"] = "error";
        $response["message"] = "Error: " . $e->getMessage();
    }
    
    return $response;
}

// Call the function if this script is accessed directly
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    $result = cleanupDatabase();
    
    // Output as JSON
    header('Content-Type: application/json');
    echo json_encode($result, JSON_PRETTY_PRINT);
}
?>