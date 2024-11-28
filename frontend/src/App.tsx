import './styles.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {RootLayout} from "./RootLayout.tsx";
import React from "react";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import EditProfilePage from "./pages/auth/EditProfilePage.tsx";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage.tsx";
import AnnouncementsPage from "./pages/auth/AnnouncementsPage.tsx";
import AddAnnouncementPage from './pages/auth/AddAnnouncementPage';


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout/>}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/announcements/add" element={<AddAnnouncementPage />} />
        </Route>,
    ),
);

function App() {
  return <RouterProvider router={router}/>;
}

export default App
