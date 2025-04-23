import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode }     from "jwt-decode";
import { useNavigate }   from "react-router-dom";

interface GoogleJwtPayload {
  email: string;
  name:  string;
  // add whatever fields you need:
  // picture?: string;
}

export default function Login() {
  const navigate = useNavigate();

  return (
    <>
      <GoogleLogin
        onSuccess={({ credential }) => {
          if (!credential) {
            console.error("Google returned no credential");
            return;
          }
          const decoded = jwtDecode<GoogleJwtPayload>(credential);
          console.log(decoded);
          navigate("/builder");        // absolute path
        }}
        onError={() => console.log("Login Failed")}
      />
    </>
  );
}
