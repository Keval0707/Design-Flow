// src/App.js
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Protected Route Component
const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

// Main App Component
function App() {
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <ProjectDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;

// User Profile Component
import { UserProfile } from '@clerk/clerk-react';

function ProfilePage() {
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <UserProfile />
    </div>
  );
}