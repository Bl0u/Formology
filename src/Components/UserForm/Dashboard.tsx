import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Dashboard.css"; // Import the CSS file for additional styling
import axios from "axios";
const Dashboard = () => {
  const [email, setEmail] = useState<string[]>([]);
  const [userForms, setUserForms] = useState('') ;

  useEffect(() => {
    const fetchEmailResponses = async () => {
      try {
        const response = await axios.get("http://localhost/Form/emails.php");
        if (response?.data) {
          setEmail(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch email responses:", error);
      }
    };

    fetchEmailResponses();
    console.log(email);
  }, []);

  const handleResponseClick = async (email: string) => {
    const response = await axios.get(
      "http://localhost/Form/dashboard.php",
      email
    );
    if (response?.data){
        console.log(response.data);
        console.log(response.data.data);
    }
  };
  console.log(email);

  return (
    <div className="dashboard-container">
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Dashboard
      </motion.h1>

      <motion.div
        className="email-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {email?.map((response) => (
          <motion.div
            key={response.user_id}
            className="email-item"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="email-text">{response.email}</span>
            <button
              className="response-button"
              onClick={() => handleResponseClick(response.email)}
            >
              Response
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
