import React, { useState,useEffect } from "react";
import { sendResetToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../assets/CareChain.png"; // ייבוא הלוגו
import backgroundImage from "../assets/img/gloves.jpg";

const ForgotPassword = () => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.minHeight = "100vh";

        return () => {
            document.body.style.backgroundImage = "";
        };
    }, []);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await sendResetToken(email);
            setError("");
            navigate(`/verify-token?email=${encodeURIComponent(email)}`);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to send reset token.");
        }
    };

    return (
        <div className="auth-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
                <button className="back-button" onClick={() => window.history.back()}>
                    Back
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ForgotPassword;
