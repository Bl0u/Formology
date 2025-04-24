// index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from "./Components/Auth/Register.tsx";

import './index.css';
import App   from './App.tsx';
import Home  from './Home.tsx';
import Login from './Components/Auth/Login.tsx';


const router = createBrowserRouter([
  { path: '/',        element: <Home /> },   // give the root path a page
  { path: '/builder', element: <App  /> },
  { path: '/login',   element: <Login/> },
  { path: '/register',   element: <Register/> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
