import axios from "axios";
export default async function validateLogin(email: string, pwd: string): Promise<boolean> {
    try {
        // Send the email as a query parameter
        const response = await axios.get('http://localhost:80/Form/loginDB.php', {
            params: { email, pwd } // Attach the email as a query parameter
        });

        // Check if the response indicates the email exists
        if (response.data.exists) {
            return true; // Login is valid
        } else {
            return false; // Login is invalid
        }
    } catch (e) {
        console.error('An error occurred while validating the login:', e);
        return false;
    }
}