import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Dashboard.css"; // Import the CSS file for additional styling
import axios from "axios";
import { useAuth } from "../Auth/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import IdleRedirect from "./IdleRedirect";
import Navbar from "../NavbarButtons/Navbar/Navbar";

const Dashboard = () => {
  const [forms, setForms] = useState([]); // Stores all form IDs
  const [selectedFormEmails, setSelectedFormEmails] = useState<
    { email: string; formId: string }[]
  >([]); // Emails with associated form IDs
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null); // Currently selected form ID
  const [responseDetails, setResponseDetails] = useState<{
    formId: string;
    email: string;
    questions: {
      question: string;
      answer_text: string;
      display_order: number;
    }[];
  } | null>(null); // Stores the response details for the selected email
  const { isLogged, setIsLogged } = useAuth();
  useEffect(() => {
    console.log("from dashboard", isLogged);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch list of all forms
        // loggedInformation: JSON.parse(localStorage.getItem('login') || '{}')

        const responseForms = await axios.get(
          "http://localhost/Form/forms.php"
        );
        if (responseForms?.data) {
          const userInfo = JSON.parse(localStorage.getItem("login"));
          console.log("userInfo = ", userInfo);

          setForms(() => 
            responseForms.data.data.filter(
              (form) => form.created_by === userInfo.email
            )
          );
          
          // setForms(responseForms.data.data);
          console.log(responseForms.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleResponseClick = async (formId: string) => {
    try {
      const response = await axios.get("http://localhost/Form/dashboard.php", {
        params: { formId },
      });
      if (response?.data) {
        // Map emails to include the formId
        const emailsWithFormId = response.data.data.map((email: string) => ({
          email,
          formId,
        }));
        setSelectedFormEmails(emailsWithFormId); // Set emails with associated form IDs
        setSelectedFormId(formId); // Store the currently selected form ID
      }
    } catch (error) {
      console.error("Failed to fetch form responses:", error);
    }
  };

  const handleUserResponse = async (formId: string, email: string) => {
    try {
      // Make an API call to fetch the user response
      const response = await axios.post(
        "http://localhost/Form/UserResponse.php",
        {
          formId,
          email,
        }
      );

      // Check if the response contains data
      if (response?.data?.status === "success" && response?.data?.data) {
        const questions = response.data.data || []; // Directly assign the array
        console.log(response.data.data);

        setResponseDetails({ formId, email, questions });
      } else {
        console.warn(`No data found for Form ID ${formId} and Email ${email}`);
        alert(`No response data found for ${email}.`);
      }
    } catch (error: any) {
      console.error(
        `Failed to fetch user response for Form ID ${formId} and Email ${email}:`,
        error
      );

      // Handle different types of errors
      if (error.response) {
        alert(
          `Error: ${
            error.response.data.message || "Failed to fetch the user response."
          }`
        );
      } else if (error.request) {
        alert(
          "No response from the server. Please check your network connection."
        );
      } else {
        alert(`Unexpected error: ${error.message}`);
      }
    }
  };
const navigator = useNavigate() ;
  return (
    <>
    <Navbar>
      <button
      onClick={() => navigator('/')}
      >Home</button>
      <button
      onClick={() => navigator('/builder')}
      >Start building</button>
    </Navbar>
    <div className="dashboard-container">
          {/* Left Panel */}
          <div className="left-panel">
            <motion.h1
              className="dashboard-title"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Dashboard
            </motion.h1>

            <motion.div
              className="form-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {forms.map((form) => (
                <motion.div
                  key={form.form_id}
                  className="form-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="form-id-text">
                    {form.first_section_title}
                  </span>
                  <button
                    className="response-button"
                    onClick={() => handleResponseClick(form.form_id)}
                  >
                    Responses
                  </button>
                </motion.div>
              ))}
            </motion.div>

            {selectedFormEmails && (
              <motion.div
                className="email-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h2>Responses for Selected Form</h2>
                {selectedFormEmails.map(({ email, formId }, index) => (
                  <motion.div
                    key={index}
                    className="email-item"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="email-text">{email}</span>
                    <button
                      className="response-button"
                      onClick={() => handleUserResponse(formId, email)}
                    >
                      Get Response
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            {responseDetails ? (
              <motion.div
                className="response-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h2>Response Details</h2>
                <div className="response-table-container">
                  <table className="response-table">
                    <thead>
                      <tr>
                        <th>Display Order</th>
                        <th>Question</th>
                        <th>Answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responseDetails.questions.map((q, index) => (
                        <tr key={index}>
                          <td>{q.display_order}</td>
                          <td>{q.question}</td>
                          <td>{q.answer_text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <p className="placeholder-text">
                Select an email to view responses
              </p>
            )}
          </div>
        </div>
    </>
  );
};

export default Dashboard;
