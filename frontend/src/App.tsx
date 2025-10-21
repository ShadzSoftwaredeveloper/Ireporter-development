import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Welcome } from './pages/Welcome';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { CreateIncident } from './pages/CreateIncident';
import { ViewIncidents } from './pages/ViewIncidents';
import { IncidentDetail } from './pages/IncidentDetail';
import { UserProfile } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/welcome" element={<Welcome />} />
            <Route 
              path="/signin" 
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/incidents" replace />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreateIncident />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/incidents"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ViewIncidents />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/incidents/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <IncidentDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
