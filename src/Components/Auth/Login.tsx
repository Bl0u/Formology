import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";
import "./Login.css" ;
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import validateLogin from "../DB/LoginDB";
import {
  faCheck,
  faTimes,
  faCircleExclamation,
  faClock,
  faUser,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "./Context/AuthContext"; // Adjust the path based on where your AuthContext file is located
interface GoogleJwtPayload {
  email: string;
  name: string;
  // add whatever fields you need:
  // picture?: string;
}
import { FormContent } from "../NavbarButtons/type";
import { store } from "../state/store";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, UseDispatch } from "react-redux";
import { resetForm, setFormRedux } from "../state/Form/FormSlice";

const Login: React.FC = () => {
  const [form, setForm] = useState<FormContent>(); // Initialize local state from Redux

  const { errMsg, setErrMsg, setAuth, success, setSuccess } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("peteremil791@gmail.com");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("Hello@#$12341010");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const emailRef = useRef(null);
  const errRef = useRef(null);

  const {emailLogged, setEmailLogged, setIsLogged} = useAuth() ;
  const dispatcher = useDispatch() ;
  useEffect(() => {
    localStorage.clear() ;
    dispatcher(resetForm(form));
    
    
  }, [])
  useEffect(() => {
    const inputRef = emailRef.current as HTMLInputElement | null;
    inputRef?.focus();
  }, []);

  useEffect(() => {
    // if at anytime the user changed anything, the error should be cleared out
    setErrMsg("");
  }, [email, pwd]);

  const location = useLocation();
  const navigator = useNavigate();
  const from = location.state?.from || "/";

  // Navigate to the "from" location or the default path
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuth({ email, pwd });
    if (from !== "/") {
      navigator(from, { replace: true });
    }
    return;
  }

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (success) {
      const redirectTimer = setTimeout(() => {
        window.location.href = "/";
      }, 5000);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [success]);

  return (
    <>
      {success ? (
        <motion.div
          className="success-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <div className="success-icon-wrapper">
            <motion.div
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </motion.div>
          </div>

          {/* Success Title */}
          <motion.h2
            className="success-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Login Successful!
          </motion.h2>

          {/* Success Message */}
          <motion.p
            className="success-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Welcome back, <strong>{email}</strong>!
            <br />
            Redirecting to the homepage in{" "}
            <span className="countdown">{countdown}</span> seconds...
          </motion.p>

          {/* Progress Bar Animation */}
          <motion.div
            className="redirect-progress"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          ></motion.div>

          {/* Meta Information */}
          <motion.div
            className="auth-meta success-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="auth-meta-item">
              <FontAwesomeIcon icon={faClock} />
              <span className="meta-label">Current Date and Time (UTC):</span>
              <span className="meta-value">{new Date().toISOString()}</span>
            </div>
            <div className="auth-meta-item">
              <FontAwesomeIcon icon={faUser} />
              <span className="meta-label">Logged-In Email:</span>
              <span className="meta-value">{email}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="auth-page">
          <div className="bg-dots"></div>

          <motion.div
            className="auth-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="auth-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link to="/">
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
              </Link>
            </motion.div>

            <motion.div
              className="auth-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="auth-decoration"></div>

              <h1>Welcome Back</h1>
              <p className="auth-subtitle">
                Sign in to continue to your account
              </p>
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                <FontAwesomeIcon icon={faCircleExclamation} />

                {errMsg}
              </p>
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <motion.input
                    ref={emailRef}
                    required
                    value={email}
                    autoComplete="off" // Add this line to disable browser autocomplete
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <motion.input
                    required
                    value={pwd}
                    autoComplete="off" // Add this line to disable browser autocomplete
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={(e) => {
                      setPwd(e.target.value);
                    }}
                  />
                </div>

                <div className="form-row">
                  <div className="checkbox-group">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>

                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  className="auth-button"
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                >
                  Sign In
                </motion.button>
              </form>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div className="social-auth">
                <div className="google-auth-button">
                  <GoogleLogin
                    onSuccess={({ credential }) => {
                      if (!credential) {
                        console.error("Google returned no credential");
                        return;
                      }
                      const decoded = jwtDecode<GoogleJwtPayload>(credential);
                      // console.log(decoded);
                      navigate("/"); // absolute path
                    }}
                    onError={() => console.log("Login Failed")}
                  />
                </div>
              </div>

              <div className="auth-footer">
                <p>
                  Don't have an account? <Link to="/register">Sign up</Link>
                </p>
                <p className="auth-timestamp">2025-04-23 16:29:29 • Bl0u</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Login;
