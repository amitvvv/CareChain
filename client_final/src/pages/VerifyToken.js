import React, { useState,useEffect } from "react";
import { verifyToken } from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../assets/img/gloves.jpg";
import logo from "../assets/CareChain.png";


const VerifyToken = () => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.minHeight = "100vh";

        return () => {
            document.body.style.backgroundImage = "";
        };
    }, []);
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email = new URLSearchParams(location.search).get("email");

    const handleVerifyToken = async (e) => {
        e.preventDefault();
        try {
            await verifyToken({ email, token });
            setError("");
            navigate("/reset-password", { state: { email, token } });
        } catch (error) {
            setError(error.response?.data?.error || "Invalid or expired token.");
        }
    };

    return (
        <div className="auth-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h2>Enter Reset Token</h2>
            <form onSubmit={handleVerifyToken} className="auth-form">
                <input
                    type="text"
                    placeholder="Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
                <button className="back-button" onClick={() => window.history.back()}>
                    Cancel
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default VerifyToken;