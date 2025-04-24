import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import sendRegisterInfoToDB from "../DB/RegisterDB";
import { generateUniqueId, RegisterInformation } from "../NavbarButtons/type";
import "./Auth.css";
import "./Register.css";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faCircleExclamation,
  faClock,
  faUser,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[A-Z][a-zA-Z0-9-_ ]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Register = () => {
  const navigator = useNavigate();
  const userRef = useRef(null);
  const errRef = useRef(null);

  const [user, setUser] = useState("Peter");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("peteremil791@gmail.com");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("Hello@#$12341010");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("Hello@#$12341010");
  const [validMatch, setValidMatch] = useState(false);
  const [MatchPwdFocus, setMatchPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const inputRef = userRef.current as HTMLInputElement | null;
    inputRef?.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    // why clearing out the error message ?, the user already read the error and adjusting the inputs, there is no need to keep the error message visible then, that's what this useEffect is actually doing
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const regInfo: RegisterInformation = { userId: generateUniqueId(), fullName: user, email, pwd };
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3) {
      setErrMsg("invalid entry");
      return;
    }
    console.log("successfull submission nigga");
    sendRegisterInfoToDB(regInfo);
    // setSuccess(true);
  };

  // useEffect(() => {
  //   if (success) {
  //     const timer = setTimeout(() => {
  //       navigator("/");
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [success]);
  return (
    <>
      {success ? (
        <motion.div
          className="success-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
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

          <motion.h2
            className="success-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Registration Successful!
          </motion.h2>

          <motion.p
            className="success-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Your account has been created successfully.
            <br />
            Redirecting to login page in <span className="countdown">
              5
            </span>{" "}
            seconds...
          </motion.p>

          <motion.div
            className="redirect-progress"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          ></motion.div>

          <motion.div
            className="auth-meta success-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="auth-meta-item">
              <FontAwesomeIcon icon={faClock} />
              <span className="meta-label">Current Date and Time (UTC):</span>
              <span className="meta-value">2025-04-24 16:52:32</span>
            </div>
            <div className="auth-meta-item">
              <FontAwesomeIcon icon={faUser} />
              <span className="meta-label">Current User's Login:</span>
              <span className="meta-value">Bl0u</span>
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

              <h1>Create Account</h1>
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
                  <label htmlFor="name">
                    Full Name
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validName ? "valid" : "hide"}
                    />
                    {/* basically the next line says, since the default value of validName is false, check if there isn't a user
              or the user hasn't typed anything yet, just use hide class, to hide the error thats supposed to appear to guide the user, yet if the valueName is false, and there exist a user, or the user has indeed typed anything, then just in this case, use invalid class, to make the error message visible and guide the user */}
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validName || !user ? "hide" : "invalid"}
                    />
                  </label>
                  <motion.input
                    ref={userRef}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    required
                    value={user}
                    id="name"
                    placeholder="John Doe"
                    autoComplete="off" // Add this line to disable browser autocomplete
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    onChange={(e) => {
                      // no need for accumulation prev + + e.target.value[0], since e.target.value always holds the entire value of the current state
                      setUser(e.target.value);
                    }}
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                  />
                  <div
                    id="uidnote"
                    className={
                      userFocus && user && !validName
                        ? "instructions"
                        : "offscreen"
                    }
                    aria-live="assertive"
                    role="alert"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>
                      4 to 24 characters.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores, hyphens allowed.
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validEmail ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validEmail || !email ? "hide" : "invalid"}
                    />
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    type="email"
                    required
                    value={email}
                    id="email"
                    placeholder="example@gmail.com"
                    autoComplete="off" // Add this line to disable browser autocomplete
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    onChange={(e) => {
                      // no need for accumulation prev + + e.target.value[0], since e.target.value always holds the entire value of the current state
                      setEmail(e.target.value);
                    }}
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="eidnote"
                  />

                  <p
                    id="eidnote"
                    className={
                      emailFocus && email && !validEmail
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                    <span className="instruction-content">
                      Enter a valid email address.
                      <br />
                      Must include an @ symbol followed by a domain.
                      <br />
                      Example: username@example.com
                    </span>
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Password
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validPwd ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validPwd || !pwd ? "hide" : "invalid"}
                    />
                  </label>
                  <motion.input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    required
                    value={pwd}
                    autoComplete="off" // Add this line to disable browser autocomplete
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    onChange={(e) => {
                      // no need for accumulation prev + + e.target.value[0], since e.target.value always holds the entire value of the current state
                      setPwd(e.target.value);
                    }}
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwidnote"
                  />

                  <p
                    id="pwdnote"
                    className={
                      pwdFocus && !validPwd ? "instructions" : "offscreen"
                    }
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                    <span className="instruction-content">
                      8 to 24 characters.
                      <br />
                      Must include uppercase and lowercase letters, a number and
                      a special character.
                      <br />
                      Allowed special characters:{" "}
                      <span aria-label="exclamation mark">!</span>{" "}
                      <span aria-label="at symbol">@</span>{" "}
                      <span aria-label="hashtag">#</span>{" "}
                      <span aria-label="dollar sign">$</span>{" "}
                      <span aria-label="percent">%</span>
                    </span>
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validMatch ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validMatch || !matchPwd ? "hide" : "invalid"}
                    />
                  </label>
                  <motion.input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    required
                    value={matchPwd}
                    autoComplete="off" // Add this line to disable browser autocomplete
                    onFocus={() => setMatchPwdFocus(true)}
                    onBlur={() => setMatchPwdFocus(false)}
                    onChange={(e) => {
                      // no need for accumulation prev + + e.target.value[0], since e.target.value always holds the entire value of the current state
                      setMatchPwd(e.target.value);
                    }}
                    aria-invalid={validMatch ? "false" : "true"}
                  />
                </div>

                <div className="checkbox-group terms-checkbox">
                  <input type="checkbox" id="agreeTerms" />
                  <label htmlFor="agreeTerms">
                    I agree to the{" "}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <motion.button
                  onClick={handleSubmit}
                  className="auth-button"
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={
                    !validEmail || !validMatch || !validName || !validPwd
                      ? true
                      : false
                  }
                >
                  Create Account
                </motion.button>
              </form>

              <div className="auth-divider">
                <span>or sign up with</span>
              </div>

              <div className="social-auth">
                <div className="google-auth-button">
                  <GoogleLogin onSuccess={() => {}} onError={() => {}} />
                </div>
              </div>

              <div className="auth-footer">
                <p>
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
                <p className="auth-timestamp">2025-04-23 16:29:29 • Bl0u</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
      ;
    </>
  );
};

export default Register;
