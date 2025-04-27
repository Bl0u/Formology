import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Register from './Components/Auth/Register';
import { AuthProvider } from './Components/Auth/Context/AuthContext';
import './index.css';
import App from './App';
import Home from './Home';
import Login from './Components/Auth/Login';

const router = createBrowserRouter([
  { path: '/', element: <Home /> }, // Root path
  { path: '/builder', element: <App /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
]);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);