import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
interface props {
  children?: ReactNode;
}

export default function Navbar(props: props) {
  const navigator = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">
            <motion.div
            >Formology</motion.div>
          </Link>
        </div>
        {props.children}
      </div>
    </nav>
  );
}
