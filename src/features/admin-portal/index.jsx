import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../job-portal/components/admin/AdminDashboard';
import { isAuthenticated, isAdmin } from '../job-portal/services/authService';
import { ToastProvider } from '../../components/ui/Toast';

const ProtectedRoute = ({ children }) => {
    // Both admin and normal users now share the single /login page,
    // but ONLY admins can enter the Admin Dashboard.
    if (!isAuthenticated() || !isAdmin()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AdminPortalApp = () => {
    return (
        <ToastProvider>
            <div className="admin-portal-wrapper">
                <Routes>
                    {/* 
                       Legacy admin login route removed or redirected 
                       Since everyone uses /login now.
                    */}
                    <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                    
                    {/* Tab-specific URL: /AdminPortal/admin/dashboard/:tab */}
                    <Route
                        path="/admin/dashboard/:tab"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Base dashboard route (defaults to overview) */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Default redirect to main login if hitting /AdminPortal directly */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </ToastProvider>
    );
};

export default AdminPortalApp;
