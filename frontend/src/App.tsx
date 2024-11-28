import './styles.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {RootLayout} from "./RootLayout.tsx";
import React from "react";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import EditProfilePage from "./pages/auth/EditProfilePage.tsx";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage.tsx";
import AdminPanel from "./pages/auth/AdminPanel.tsx";
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout/>}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/admin-panel" element={<AdminPanel/>}/>
        </Route>,
    ),
);

function App() {
  return <RouterProvider router={router}/>;
}

export default App
