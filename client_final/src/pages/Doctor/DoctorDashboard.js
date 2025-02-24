import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUserDetails } from "../../api/api";
import logo from "../../assets/CareChain.png";
import ContactSupport from '../../pages/ContactSupport';


const DoctorDashboard = () =>  {
    const [showSupportPopup, setShowSupportPopup] = useState(false);
    const navigate = useNavigate();
    const [doctorName, setDoctorName] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("https://localhost/auth-check", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.status !== 200) {
                    throw new Error("Not authenticated");
                }

                const userDetails = await getUserDetails();
                setDoctorName(`${userDetails.data.firstName} ${userDetails.data.lastName}`);
            } catch (error) {
                navigate("/login");
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
                <img src={logo} alt="CareChain Logo" className="dashboard-logo" />  {/* לוגו */}
                <h1>Welcome, Dr. {doctorName}</h1>  {/* הצגת שם הרופא */}
                <p>Manage your medical contracts and appointments</p>
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
                    <p>View and edit your professional information</p>
                    <Link to="/profile" className="dashboard-button">Go to Profile</Link>
                </div>
                <div className="dashboard-card">
                    <h2>Patient Contracts</h2>
                    <p>Review, approve, and manage medical contracts</p>
                    <Link to="/contracts" className="dashboard-button">Manage Contracts</Link>
                </div>
                <div className="dashboard-card">
                    <h2>Appointments</h2>
                    <p>Schedule and manage patient appointments</p>
                    <Link to="/appointments" className="dashboard-button">Manage Appointments</Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;