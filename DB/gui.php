<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Cleanup Tool</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .warning { color: red; font-weight: bold; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; }
        .success { color: green; }
        .error { color: red; }
        button { padding: 10px 15px; background: #d9534f; color: white; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Database Cleanup Tool</h1>
    <div class="warning">
        <p>⚠️ WARNING: This will delete ALL data from ALL tables in the 'wdt' database.</p>
        <p>This action CANNOT be undone. Make sure you have a backup if needed.</p>
    </div>
    
    <?php
    // Include the cleanup function
    require_once 'cleanup.php';
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirm_cleanup'])) {
        try {
            $result = cleanupDatabase();
            echo '<h2 class="'.($result['status'] === 'success' ? 'success' : 'error').'">'.$result['message'].'</h2>';
            echo '<h3>Details:</h3>';
            echo '<pre>';
            foreach ($result['details'] as $detail) {
                echo htmlspecialchars($detail) . "\n";
            }
            echo '</pre>';
        } catch (Exception $e) {
            echo '<h2 class="error">Fatal Error: ' . htmlspecialchars($e->getMessage()) . '</h2>';
        }
    } else {
    ?>
    <form method="post" onsubmit="return confirm('Are you ABSOLUTELY sure you want to delete ALL data?');">
        <p>
            <button type="submit" name="confirm_cleanup" value="1">
                I understand the risks - Clean All Tables
            </button>
        </p>
    </form>
    <?php } ?>
</body>
</html>