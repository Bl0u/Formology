import axios from "axios";
import { SectionContent } from "../NavbarButtons/type.ts";

export async function sendSection(sectionContent: SectionContent[]) {
  console.log("Sending data to PHP server...", JSON.stringify(sectionContent));

  try {
    // Method 1: Using explicit JSON.stringify and content type
    const response = await axios({
      method: "post",
      url: "http://localhost/Form/sections.php",
      data: JSON.stringify(sectionContent), // Explicitly stringify the data
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
