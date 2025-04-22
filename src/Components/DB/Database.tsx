import { FormContent } from "../NavbarButtons/type.ts";
import { sendSection } from "./sections.tsx";
import axios from "axios";
import { SectionContent } from "../NavbarButtons/type.ts";

// export async function sendToDB(form: FormContent) {
//   const sectionContent = form.sections;

//   try {
//     // sendSection(form.sections);
//     console.log(
//       "Sending data to PHP server...",
//       JSON.stringify(sectionContent)
//     );

//     try {
//       // Method 1: Using explicit JSON.stringify and content type
//       const response = await axios({
//         method: "post",
//         url: "http://localhost/Form/sections.php",
//         data: JSON.stringify(sectionContent), // Explicitly stringify the data
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       });
//       console.log("Server response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error sending data to server:", error);

//       // Enhanced error reporting
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           console.error("Server responded with error:", error.response.data);
//           console.error("Status:", error.response.status);
//         } else if (error.request) {
//           console.error("No response received from server");
//         }
//       }

//       throw error;
//     }
//     // sendQuestion(sectionContent.questions ?? []);

//     // there is multiple question, so i can't send sectionContent.questions.values
//     // i have to send values for specific question index
//     // sendValues(sectionContent.questions ?? []) ;
//   } catch (error) {
//     console.log("error at sendToDB");
//   }
// }

export async function sendToDB(form: FormContent) {
  const sectionContent = form.sections ;
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
