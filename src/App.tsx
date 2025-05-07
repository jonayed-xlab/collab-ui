import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Dashboard pages
import HomePage from "./pages/dashboard/HomePage";

// Profile pages
import ProfilePage from "./pages/profile/ProfilePage";
import ChangePasswordPage from "./pages/profile/ChangePasswordPage";

// Project pages
import ProjectsPage from "./pages/project/ProjectsPage";
import CreateProjectPage from "./pages/project/CreateProjectPage";

// Work Package pages
import WorkPackagesPage from "./pages/workPackage/WorkPackagesPage";
import CreateWorkPackagePage from "./pages/workPackage/CreateWorkPackagePage";

// Activity pages
import ActivityPage from "./pages/activity/ActivityPage";

import MembersPage from "./pages/members/MembersPage";
import WorkPackagesPageAll from "./pages/workPackage/WorkPackagesPageAll";
import AssignUserToProjectPage from "./pages/project/AssignUserToProjectPage";
import ProjectDetailsPage from "./pages/project/ProjectDetailsPage";
import RoadmapPage from "./pages/roadmap/RoadmapPage";
import WikiPage from "./pages/wiki/WikiPage";

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Public route component (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Auth routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Dashboard routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Profile routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Project routes */}
            <Route
              path="/assign-user-to-project"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <ProtectedRoute>
                  <CreateProjectPage />
                </ProtectedRoute>
              }
            />

            {/* Work Package routes */}
            <Route
              path="/work-packages"
              element={
                <ProtectedRoute>
                  <WorkPackagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-packages/all"
              element={
                <ProtectedRoute>
                  <WorkPackagesPageAll />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-packages/create"
              element={
                <ProtectedRoute>
                  <CreateWorkPackagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/work-packages/create"
              element={
                <ProtectedRoute>
                  <CreateWorkPackagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetailsPage />
                </ProtectedRoute>
              }
            />
            {/* Work Package routes */}
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <MembersPage />
                </ProtectedRoute>
              }
            />
            {/* Activity routes */}
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <ActivityPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wiki"
              element={
                <ProtectedRoute>
                  <WikiPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return <AppRoutes />;
};

export default App;
