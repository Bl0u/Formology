import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
interface GoogleJwtPayload {
  email: string;
  name:  string;
  // add whatever fields you need:
  // picture?: string;
}
const Login: React.FC = () => {
  const navigator = useNavigate() ;
  return (
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
            <span>MINIMALIST</span>
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
          <p className="auth-subtitle">Sign in to continue to your account</p>

          <form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                type="email"
                id="email"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                type="password"
                id="password"
                placeholder="••••••••"
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
                  console.log(decoded);
                  navigator("/"); // absolute path
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
  );
};

export default Login;
