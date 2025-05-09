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
          <div className="geometric-shape"></div>
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

        <div className="feature-cards">
          {[
            {
              title: "Minimalist",
              description: "Less is more. Focus on what really matters.",
            },
            {
              title: "Animated",
              description: "Subtle movements bring your content to life.",
            },
            {
              title: "Responsive",
              description: "Looks great on every device, every time.",
            },
          ].map((feature, index) => (
            <motion.div
              className="feature-card"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="card-icon">
                <motion.div
                  className="icon-circle"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.5,
                  }}
                ></motion.div>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Projects
        </motion.h2>

        <div className="projects-gallery">
          {[1, 2, 3, 4].map((item, index) => (
            <motion.div
              className="project-item"
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="project-overlay">
                <h3>Project {item}</h3>
                <p>Black & White Design</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <p>© 2025 Minimalist Design. Created by Bl0u.</p>
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
