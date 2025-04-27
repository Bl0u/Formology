import {
  generateUniqueId,
  FormContent,
  ChildProps,
} from "../../NavbarButtons/type";
import { useRef, RefObject } from "react";

import {
  useContext,
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import validateLogin from "../../DB/LoginDB";

// Define the shape of your auth state
interface AuthState {
  email: string;
  pwd: string;
  role?: Number;
  accessToken?: string;
}

// Define the context type
interface AuthContextType {
  auth: AuthState | null;
  setAuth: Dispatch<SetStateAction<AuthState | null>>;
  errMsg: string;
  setErrMsg: Dispatch<SetStateAction<string>>;
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  form: FormContent | null;
  setForm: Dispatch<SetStateAction<FormContent>>;
  globalFormState: FormContent ;
  getChildState: () => void ;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [success, setSuccess] = useState(false);
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const [form, setForm] = useState<FormContent>({
    formId: generateUniqueId(),
    sections: [],
  });
  const globalFormState = {} as FormContent ;


  const getChildState = () => {
    Object.assign(globalFormState, form);
    console.log('got the child state and its saved at getChildState from Auth');
    
  }


  // useEffect(() => {
  //   if (childRef.current) {
  //     setForm(childRef.current);
  //   }
  // }, []);



  useEffect(() => {
    if (auth?.email) {
      const hope = async () => {
        if (await validateLogin(auth.email, auth.pwd)) {
          // while fetching always use await
          setSuccess(true);
        } else {
          setErrMsg("No account corresponds to that email.");
        }
      };

      hope();
    }
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
        globalFormState,
        getChildState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
