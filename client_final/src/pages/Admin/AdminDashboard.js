import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/api";
import "./AdminDashboard.css";
import logo from "../../assets/CareChain.png";


export default () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("https://localhost/auth-check-admin", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.status !== 200) {
                    throw new Error("Not authenticated");
                }
            } catch (error) {
                setError("Authentication failed. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <img src={logo} alt="CareChain Logo" className="login-logo"/>
                <h2>You are logged in as an Admin</h2>
                <p>Your secure medical management platform</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h2>My Profile</h2>
                    <p>View and edit your personal information</p>
                    <Link to="/profile" className="dashboard-button">Go to Profile</Link>
                </div>

                <div className="dashboard-card">
                    <h2>User Management</h2>
                    <p>Add, edit, and delete users</p>
                    <Link to="/user-management" className="dashboard-button">Manage Users</Link>
                </div>

                <div className="dashboard-card">
                    <h2>View Medical Contracts</h2>
                    <p>Explore and review detailed contract information</p>
                    <Link to="/view-contracts" className="dashboard-button">View Contracts</Link>
                </div>

                <div className="dashboard-card">
                    <h2>Support Requests</h2>
                    <p>Manage and review user support requests</p>
                    <Link to="/admin/support-requests" className="dashboard-button">View Requests</Link>
                </div>

            </div>
        </div>
    );
};