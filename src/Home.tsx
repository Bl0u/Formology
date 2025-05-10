import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import { useNavigate, useRoutes } from "react-router-dom";
import { useAuth } from "./Components/Auth/Context/AuthContext";
// import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
  const navigator = useNavigate();
  // const navigator = useNavigate() ;
  const [scrollY, setScrollY] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState("hero");
  const { isLogged } = useAuth();
  // Handle scroll position for parallax and section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Simple section tracking
      // const heroSection = document.getElementById("hero");
      const aboutSection = document.getElementById("about");
      const projectsSection = document.getElementById("projects");
      const loginSection = document.getElementById("login");

      if (loginSection && window.scrollY > loginSection.offsetTop - 200) {
        setActiveSection("login");
      } else if (
        projectsSection &&
        window.scrollY > projectsSection.offsetTop - 200
      ) {
        setActiveSection("projects");
      } else if (
        aboutSection &&
        window.scrollY > aboutSection.offsetTop - 200
      ) {
        setActiveSection("about");
      } else {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track cursor for subtle interactivity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Text animation elements
  const words = ["Simple.", "Creative.", "Elegant.", "Bold."];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Subtle background movement based on cursor position
  const backgroundStyle = {
    transform: `translate(${cursorPosition.x / 100}px, ${
      cursorPosition.y / 100
    }px)`,
    backgroundColor: "black", // Explicitly set background color
    minHeight: "100vh", // Ensure it fills the viewport height
    width: "100%",
  };

  return (
    <div className="home-container">
      {/* Subtle animated background dots */}
      <div className="bg-dots" style={backgroundStyle}></div>

      {/* Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="logo">
          <motion.div
            className="logo-circle"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>
          <span>Formology</span>
        </div>

        <nav>
          <ul>
            {["Home", "About", "Projects", "Contact"].map((item) => (
              <motion.li
                key={item}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={`#${item.toLowerCase()}`}
                  className={
                    activeSection === item.toLowerCase() ? "active" : ""
                  }
                >
                  {item}
                </a>
              </motion.li>
            ))}

            {!isLogged && (
              <>
                <motion.li
                  key="Register"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="/register"
                    className={activeSection === "register" ? "active" : ""}
                  >
                    Register
                  </a>
                </motion.li>
                <motion.li
                  key="Login"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="/login"
                    className={activeSection === "login" ? "active" : ""}
                  >
                    Login
                  </a>
                </motion.li>
              </>
            )}

            {isLogged && (
              <motion.li
                key="Dashboard"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/dashboard"
                  className={activeSection === "dashboard" ? "active" : ""}
                >
                  Dashboard
                </a>
                <motion.button
                  className={activeSection === "dashboard" ? "active" : ""}
                  onClick={() => {
                    localStorage.removeItem('login') ;
                    window.location.reload();

                  }}
                >
                  log out
                </motion.button>
              </motion.li>
            )}
          </ul>
        </nav>
      </motion.header>


      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Black & White.{" "}
            <span className="highlighted">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {words[currentWord]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A clean, minimal approach to modern design that focuses on what
            truly matters.
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              className="primary-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator("/builder");
              }}
            >
              Get Started
            </motion.button>
            <motion.button
              className="secondary-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="src\ChatGPT Image May 3, 2025, 04_53_51 AM.png"
            alt="formology Design"
            className="hero-image-content"
          />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          About
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          style={{
            color: "gold",
            fontSize: "1.2rem",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          formology is your ultimate platform for crafting sleek, powerful, and
          intuitive digital experiences. Like Google Forms, it simplifies the
          process of gathering and organizing information, but with unparalleled
          elegance and flexibility. Create stunning forms, surveys, and
          interactive interfaces with drag-and-drop ease, customize every detail
          to match your vision, and integrate seamlessly with your favorite
          tools. With real-time analytics, advanced logic, and a formology
          aesthetic, formology empowers you to build not just forms, but
          experiences that captivate and convert—effortlessly.
        </motion.p>
      </section>

      {/* How To Use Section */}
      <section id="how-to-use" className="how-to-use-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          How To Use
        </motion.h2>

        <motion.div
          className="video-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <video
            src="/formology-tutorial.mp4"
            controls
            className="tutorial-video"
            poster="/tutorial-poster.jpg"
          >
            Your browser does not support the video tag.
          </video>
          <p style={{ color: "gold", textAlign: "center", marginTop: "1rem" }}>
            Watch our tutorial to learn how to create stunning forms and
            interfaces with formology.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <p>© 2025 formology Design.</p>
          <div className="social-links">
            {["Twitter", "Instagram", "LinkedIn"].map((social, index) => (
              <motion.a
                href="#"
                key={index}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
