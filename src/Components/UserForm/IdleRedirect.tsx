import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IdleRedirect = ({ isLogged }: { isLogged: boolean }) => {
  const navigator = useNavigate();

  useEffect(() => {
    let idleTimer: NodeJS.Timeout | null = null;

    const resetIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      // Start a new timeout
      idleTimer = setTimeout(() => {
        if (!isLogged) {
          navigator("/login", {
            state: { from: window.location.pathname },
            replace: true,
          });
        }
      }, 3000); // 10 seconds
    };

    // Attach event listeners to detect user activity
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);

    // Initialize the timer when the component mounts
    resetIdleTimer();

    // Clean up event listeners and timer on component unmount
    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
    };
  }, [isLogged, navigator]);

  return (
    <h2 style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
      You are not authorized to access this page. Redirecting you to the login page. Please wait...
    </h2>
  );
};

export default IdleRedirect;