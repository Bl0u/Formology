import { FormContent } from "../NavbarButtons/type.ts";
import axios from "axios";

export async function sendToDB(form: FormContent) {
  // const sectionContent = form.sections ;
  const newForm = {
    ...form, 
    loggedInformation: JSON.parse(localStorage.getItem('login') || '{}')
  }
  console.log("Sending data to PHP server...", JSON.stringify(newForm));

  try {
    // Method 1: Using explicit JSON.stringify and content type
    const response = await axios({
      method: "post",
      url: "http://localhost/Form/sections.php",
      data: JSON.stringify(newForm), // Explicitly stringify the data
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending data to server:", error);

    // Enhanced error reporting
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        console.error("No response received from server");
      }
    }

    throw error;
  }
}
