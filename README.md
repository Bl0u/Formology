# Formology

## About
Formology AI-Powered Form Builder — a powerful and intuitive alternative to Google Forms. It delivers all the core features you'd expect, but goes beyond with AI-driven form generation. Simply enter your topic, and our AI crafts a complete, well-structured form — including styled layouts, intelligently phrased questions, and optimized formats — so you don’t have to waste time figuring out how to ask the right question.
It’s versatile and fully customizable: edit, remove, or add anything with ease. Whether you're building surveys, applications, or quizzes, this is your all-in-one, intelligent form-building assistant.


## Features
- AI-driven question generation
- Fully editable and responsive design
- Real-time preview and form validation


## Tech Stack
- **Frontend**: TypeScript (49.6%)
- **Styling**: CSS (31.6%)
- **Backend**: PHP (18.3%)
- **Other**: (0.5%)

## Documentation
Detailed documentation, architecture overview is available as a Word document in the project repository:
C:\Users\peter\Downloads\WDT Project\Formology\Formology.docx

# Project Setup Guide

This guide explains how to set up and run the project using XAMPP, including adding required files, running the PHP server, and using the application.

---

## 1. Installing Required Tools

### Install XAMPP
1. Download XAMPP from [https://www.apachefriends.org](https://www.apachefriends.org).
2. Install XAMPP with the following default components:
   - Apache
   - MySQL
   - PHP
   - phpMyAdmin

---

## 2. Setting Up Project Files

### Locate the XAMPP Directory
- **Windows:** `C:\xampp\htdocs`
- **Mac:** `/Applications/XAMPP/htdocs`
- **Linux:** `/opt/lampp/htdocs`

### Add Files to `htdocs`
1. Extract the following files:
   - `LandingPage`
   - `WDT Project`
   - Copy what is in 'COPY' folder to `xampp/htdocs`
2. The directory structure should look like this:
   ```
   ├── xampp
       ├── htdocs
           ├── forms.php
           ├── ...
   ```

---

## 3. Running the Project

### Running the Landing Page
1. Open the `LandingPage` folder in **VS Code**.
2. Install the "Live Server" extension in VS Code.
3. Right-click on `index.html` in the `landing-page` folder and select "Open with Live Server".
4. Access the Landing Page at: [http://localhost:5500](http://localhost:5500).

### Running the PHP Backend
1. Open the XAMPP Control Panel.
2. Start the Apache and MySQL servers.
3. Verify that the PHP server is running by visiting: [http://localhost](http://localhost).

# Database Setup Guide

This section describes how to establish the `wdt` database and its schema.

---

## Steps to Establish the Database

### 1. Access phpMyAdmin
1. Open XAMPP Control Panel.
2. Ensure both **Apache** and **MySQL** servers are running.
3. Open phpMyAdmin in your browser: [http://localhost/phpmyadmin](http://localhost/phpmyadmin).

### 2. Create the Database
1. In phpMyAdmin, click **New** on the left-hand menu.
2. Enter `wdt` as the database name.
3. Set the collation to `utf8mb4_general_ci`.
4. Click **Create**.

### 3. Import the Database Schema
1. Open the SQL tab in phpMyAdmin for the `wdt` database.
2. Paste the following SQL schema into the query box and execute it:

```sql
CREATE TABLE `answers` (
    `answer_id` int(11) NOT NULL AUTO_INCREMENT,
    `response_id` int(11) NOT NULL,
    `question_id` varchar(36) NOT NULL,
    `section_id` varchar(36) NOT NULL,
    `answer_text` text DEFAULT NULL,
    PRIMARY KEY (`answer_id`),
    KEY `response_id` (`response_id`),
    KEY `question_id` (`question_id`),
    KEY `section_id` (`section_id`),
    CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`response_id`) REFERENCES `responses` (`response_id`) ON DELETE CASCADE,
    CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE,
    CONSTRAINT `answers_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `forms` (
    `form_id` varchar(36) NOT NULL,
    `status` varchar(20) DEFAULT 'active',
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `created_by` varchar(50) NOT NULL,
    `updated_at` datetime DEFAULT NULL,
    `updated_by` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`form_id`),
    UNIQUE KEY `idx_form_id` (`form_id`),
    KEY `idx_form_status` (`status`),
    KEY `idx_form_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `questions` (
    `question_id` varchar(36) NOT NULL,
    `section_id` varchar(36) NOT NULL,
    `question_type` varchar(20) NOT NULL,
    `question` text NOT NULL,
    `is_required` tinyint(1) NOT NULL DEFAULT 0,
    `display_order` int(11) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `created_by` varchar(50) NOT NULL,
    PRIMARY KEY (`question_id`),
    KEY `idx_section_id` (`section_id`),
    CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `question_values` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `question_id` varchar(36) NOT NULL,
    `value_text` text NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `created_by` varchar(50) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_question_id` (`question_id`),
    CONSTRAINT `question_values_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `responses` (
    `response_id` int(11) NOT NULL AUTO_INCREMENT,
    `form_id` varchar(36) NOT NULL,
    `user_id` int(11) NOT NULL,
    `submitted_at` datetime NOT NULL,
    `submitted_by` varchar(50) NOT NULL,
    PRIMARY KEY (`response_id`),
    KEY `form_id` (`form_id`),
    CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sections` (
    `section_Id` varchar(36) NOT NULL,
    `form_id` varchar(36) NOT NULL,
    `title` varchar(255) NOT NULL,
    `display_order` int(11) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `created_by` varchar(50) NOT NULL,
    PRIMARY KEY (`section_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT,
    `full_name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9323 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

3. Click **Go** to execute the query and create the database schema.

---

## Verification
1. Return to the phpMyAdmin main page.
2. Select the `wdt` database and ensure the following tables are present:
   - `answers`
   - `forms`
   - `questions`
   - `question_values`
   - `responses`
   - `sections`
   - `users`

3. Confirm that the structure matches the schema provided above.

---

## Notes
- Ensure that your PHP project is configured to use the `wdt` database, and the database credentials in your `config.php` file match your setup:
  ```php
  <?php
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "wdt";

  $conn = new mysqli($servername, $username, $password, $dbname);

  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }
  ?>
  ```
- If the schema includes foreign key constraints, ensure InnoDB is enabled as the storage engine.

---

You should now have the database fully set up and ready to use!
---
## 4. User Flow Walkthrough

### Accessing the Landing Page
1. Open the Landing Page in your browser: [http://localhost:5500](http://localhost:5500).
2. Click on the **"Start Building"** button. This will redirect you to the main PHP application at [http://localhost/wdt-project](http://localhost/wdt-project).

### Using the Application
1. **Register:**  
   Navigate to `/register` and create a new account by entering your full name, email, and password.  
   (This stores your information in the `users` table in the database.)
   
2. **Login:**  
   Navigate to `/login`, enter your credentials, and log in.  
   (The system verifies your login details against the `users` table.)

3. **Start Building a Form:**  
   - Click on **"New Form"** to start building a new form.
   - Use the **"Add Section"** button to add sections to your form.
   - Use the **"Ask AI"** feature to automatically generate form questions:
     - Example prompt: "Create a customer feedback form with 3 questions."
     - (The system creates entries in the `questions` and `question_values` tables.)

4. **Publish the Form:**  
   - Use the **"Preview"** button to review your form.
   - Click **"Publish"** once you're satisfied with the form.
   - (This updates the `forms.status` field to `'published'` in the database.)

5. **Share the Form:**  
   - Copy the shareable link: `http://localhost/wdt-project/form/{form-id}`.
   - Send this link to your friend or colleague.

6. **Submit Responses:**  
   - Your friend can access the form using the shareable link and submit their responses.
   - (The responses are stored in the `responses` and `answers` tables in the database.)

7. **View Analytics:**  
   - Navigate to `/dashboard` to see detailed analytics for your forms.
   - View response statistics and individual answers.

---

## 5. Additional Configuration

### PHP Configuration
Create a `config.php` file in the XAMPP `htdocs/wdt-project` folder with the following content:
```php
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wdt";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
```

### Database Setup
1. Start the XAMPP Control Panel and ensure MySQL is running.
2. Access phpMyAdmin: [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Create a database named `wdt`.
4. Import the provided SQL file (if any) to set up the database structure and sample data.

---

## 6. Troubleshooting

### Common Issues
1. **Port Conflicts:**  
   If the default Apache port (80) is already in use, change it to a different port in XAMPP settings.

2. **PHP Errors:**  
   - Check the XAMPP error logs at `xampp/apache/logs/error.log`.
   - Ensure all PHP files are inside the `htdocs/wdt-project` folder.

3. **Database Connection Issues:**  
   - Verify the MySQL credentials in `config.php`.
   - Check database table permissions in phpMyAdmin.

---

## 7. Security Recommendations

### General
- Use HTTPS for all production deployments.

### Database
- Use a dedicated MySQL user account with limited permissions instead of `root`.

---