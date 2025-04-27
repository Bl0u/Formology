import { useContext, createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the shape of your auth state
interface AuthState {
  email: string, 
  pwd: string, 
  role?: Number,
  accessToken?: string ;
}

// Define the context type
interface AuthContextType {
  auth: AuthState | null;
  setAuth: Dispatch<SetStateAction<AuthState | null>>;
  errMsg: string;
  setErrMsg: Dispatch<SetStateAction<string>>;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        errMsg,
        setErrMsg,
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