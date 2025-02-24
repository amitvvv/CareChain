import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/api";
import logo from "../../assets/CareChain.png";
import ContactSupport from '../../pages/ContactSupport';



export default () => {
    const [showSupportPopup, setShowSupportPopup] = useState(false);
    const navigate = useNavigate();

    // בדיקת אימות כאשר הרכיב נטען
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("https://localhost/auth-check", {
                    method: "GET",
                    credentials: "include", // שולח את ה-cookie עם הבקשה
                });

                if (response.status !== 200) {
                    throw new Error("Not authenticated");
                }
            } catch (error) {
                // אם המשתמש לא מאומת, נעבור לעמוד ההתחברות
                navigate("/login");
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout(); // קריאת פונקציית logout
            navigate("/"); // מעבר לעמוד הבית
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <img src={logo} alt="CareChain Logo" className="dashboard-logo"/> {/* לוגו */}
                <h1>Welcome to CareChain</h1>
                <p>Your secure medical management platform</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <button
                    className="contact-support-button"
                    onClick={() => setShowSupportPopup(true)}
                >
                    Contact Support
                </button>
                {showSupportPopup && <ContactSupport onClose={() => setShowSupportPopup(false)} />}
            </header>
            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h2>My Profile</h2>
                    <p>View and edit your personal information</p>
                    <Link to="/profile" className="dashboard-button">Go to Profile</Link>
                </div>
                <div className="dashboard-card">
                    <h2>Medical Contracts</h2>
                    <p>Review, approve, and manage medical contracts</p>
                    <Link to="/contracts" className="dashboard-button">Manage Contracts</Link>
                </div>
                <div className="dashboard-card">
                    <h2>Appointments</h2>
                    <p>Schedule and manage medical appointments</p>
                    <Link to="/appointments" className="dashboard-button">Manage Appointments</Link>
                </div>
            </div>
        </div>
    );
};
