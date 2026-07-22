import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { NotificationProvider } from "./context/NotificationContext";
import { I18nProvider } from "./context/I18nContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import Toast from "./components/Toast";
import { ROLES } from "./utils/constants";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseInternships from "./pages/BrowseInternships";
import Recommendations from "./pages/Recommendations";
import Bot from "./pages/Bot";

import Onboarding from "./pages/student/Onboarding";
import ProfileEdit from "./pages/student/ProfileEdit";
import SavedInternships from "./pages/student/SavedInternships";
import MyApplications from "./pages/student/MyApplications";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostInternship from "./pages/recruiter/PostInternship";
import MyListings from "./pages/recruiter/MyListings";
import Applicants from "./pages/recruiter/Applicants";
import Analytics from "./pages/recruiter/Analytics";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageListings from "./pages/admin/ManageListings";

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <Navbar />

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/internships" element={<BrowseInternships />} />
              <Route path="/bot" element={<Bot />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/recommendations" element={<Recommendations />} />

                <Route element={<RoleRoute allowedRoles={[ROLES.STUDENT]} />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/profile" element={<ProfileEdit />} />
                  <Route path="/saved" element={<SavedInternships />} />
                  <Route path="/applications" element={<MyApplications />} />
                </Route>

                <Route element={<RoleRoute allowedRoles={[ROLES.RECRUITER]} />}>
                  <Route path="/recruiter" element={<RecruiterDashboard />} />
                  <Route path="/recruiter/post" element={<PostInternship />} />
                  <Route path="/recruiter/listings" element={<MyListings />} />
                  <Route path="/recruiter/listings/:id/applicants" element={<Applicants />} />
                  <Route path="/recruiter/analytics" element={<Analytics />} />
                </Route>

                <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/listings" element={<ManageListings />} />
                </Route>
              </Route>
            </Routes>

            <MobileNav />
            <Toast />
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}
