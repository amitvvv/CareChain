import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../api/api";
import "./MyProfile.css";
import logo from "../assets/CareChain.png";


const MyProfile = () => {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        idNumber: "",
        birthDate: "",
        userType: "",
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await getUserDetails();
                setUserData(response.data);
            } catch (err) {
                setError("Failed to fetch user details. Please try again later.");
            }
        };

        fetchUserDetails();
    }, []);

    // USER TYPE
    const userTypeMapping = {
        0: "Admin",
        1: "Doctor",
        2: "Patient",
    };

    return (
        <div className="my-profile-container">
            <img src={logo} alt="CareChain Logo" className="myprofile-logo"/>
            <h2>My Profile</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="profile-details">
                <p><strong>First Name:</strong> {userData.firstName}</p>
                <p><strong>Last Name:</strong> {userData.lastName}</p>
                <p><strong>ID Number:</strong> {userData.idNumber}</p>
                <p><strong>Birth Date:</strong> {new Date(userData.birthDate).toLocaleDateString()}</p>
                <p><strong>Phone:</strong> {userData.phone}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>User Type:</strong> {userTypeMapping[userData.userType]}</p>
            </div>
            <button className="back-button" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default MyProfile;
