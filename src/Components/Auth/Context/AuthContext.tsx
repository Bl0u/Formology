import {
  generateUniqueId,
  FormContent,
} from "../../NavbarButtons/type";
import { useRef, createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useContext } from "react";
import validateLogin from "../../DB/LoginDB";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

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
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  form: FormContent | null;
  setForm: Dispatch<SetStateAction<FormContent>>;
  globalFormStateRef: React.MutableRefObject<FormContent>;
  getChildState: () => void;
  isReview: boolean ;
  setIsReview: Dispatch<SetStateAction<boolean>>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
  const [isReview, setIsReview] = useState(false) ;

  useEffect(() => {
    setForm(formFromRedux);
    // console.log("here from context");
  }, [formFromRedux]);

  const getChildState = () => {
    globalFormStateRef.current = { ...form };
    // console.log("got the child state and its saved at getChildState from Auth");
  };

  useEffect(() => {
    if (auth?.email) {
      const hope = async () => {
        if (await validateLogin(auth.email, auth.pwd)) {
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
        globalFormStateRef,
        getChildState,
        isReview, 
        setIsReview,
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