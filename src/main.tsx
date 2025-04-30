import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import Register from "./Components/Auth/Register";
import { AuthProvider } from "./Components/Auth/Context/AuthContext";
import "./index.css";
import App from "./App";
import Home from "./Home";
import Login from "./Components/Auth/Login";
import ReviewFormPage from "./Components/ReviewForm/ReviewFormPage";
import { Provider } from "react-redux";
import { store } from "./Components/state/store";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import UserForm from "./Components/UserForm/UserForm";

const router: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/builder", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/reviewForm", element: <ReviewFormPage /> },
  { path: "/userFormBuilder/:formId", element: <UserForm /> },
];

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found. Check your HTML structure.");
} else {
  const persistor = persistStore(store);

  const FallbackComponent = ({ error }: { error: Error }) => (
    <div>Something went wrong: {error.message}</div>
  );

  createRoot(rootElement).render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AuthProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <ErrorBoundary FallbackComponent={FallbackComponent}>
                <RouterProvider router={createBrowserRouter(router)} />
              </ErrorBoundary>
            </GoogleOAuthProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
  );
}