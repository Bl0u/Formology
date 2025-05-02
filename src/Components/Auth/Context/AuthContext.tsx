import { generateUniqueId, FormContent } from "../../NavbarButtons/type";
import {
  useRef,
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from "react";
import validateLogin from "../../DB/LoginDB";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

interface AuthState {
  email: string;
  pwd: string;
  role?: Number;
  accessToken?: string;
}

interface AuthContextType {
  auth: AuthState | null;
  setAuth: Dispatch<SetStateAction<AuthState | null>>;
  errMsg: string;
  setErrMsg: Dispatch<SetStateAction<string>>;
  emailLogged: string;
  setEmailLogged: Dispatch<SetStateAction<string>>;
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  form: FormContent | null;
  setForm: Dispatch<SetStateAction<FormContent>>;
  globalFormStateRef: React.MutableRefObject<FormContent>;
  getChildState: () => void;
  isReview: boolean;
  setIsReview: Dispatch<SetStateAction<boolean>>;
  isLogged: boolean ;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false) ;
  const [emailLogged, setEmailLogged] = useState('') ;
  const [success, setSuccess] = useState(false);
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const formFromRedux = useSelector((state: RootState) => state.form.value);
  const [form, setForm] = useState<FormContent>(
    formFromRedux || {
      formId: generateUniqueId(),
      sections: [],
    }
  );
  const globalFormStateRef = useRef<FormContent>({} as FormContent);
  const [isReview, setIsReview] = useState(false);

  useEffect(() => {
    setForm(formFromRedux);
    // console.log("here from context");
  }, [formFromRedux]);

  const getChildState = () => {
    globalFormStateRef.current = { ...form };
    // console.log("got the child state and its saved at getChildState from Auth");
  };

  

  const location = useLocation();
  const navigator = useNavigate();
  const from = location.state?.from || "/";
useEffect(() => {
  console.log('useEffect on isLogged', isLogged);
  
}, [isLogged])
  useEffect(() => {
    const handleLogin = async () => {
      try {
        if (auth?.email) {
          const isValid = await validateLogin(auth.email, auth.pwd);
          if (isValid) {
            // console.log(from);
            setEmailLogged(auth.email)  ;
            navigator(from, { replace: true });
            
            setSuccess(true) ;
            setIsLogged(true) ;
            console.log('from authcontext', isLogged);
            
          } else {
            setErrMsg("No account corresponds to that email.");
          }
        }
      } catch (error) {
        console.error("Error during login validation:", error);
        setErrMsg("An error occurred during login. Please try again.");
      }
    };

    handleLogin();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        errMsg,
        setErrMsg,
        success,
        setSuccess,
        form,
        setForm,
        globalFormStateRef,
        getChildState,
        isReview,
        setIsReview,
        isLogged, 
        setIsLogged,
        emailLogged,
        setEmailLogged,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
