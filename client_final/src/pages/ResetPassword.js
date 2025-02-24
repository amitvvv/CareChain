// src/components/ResetPassword.js
import React, { useState } from "react";
import { resetPassword } from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const validToken = location.state?.token;

    if (!email || !validToken) {
        navigate("/verify-token");
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await resetPassword({ email, token: validToken, newPassword });
            setError("");
            navigate("/"); // מעבר לעמוד הראשי לאחר שינוי הסיסמה בהצלחה
        } catch (error) {
            setError(error.response?.data?.error || "Failed to reset password.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword} className="auth-form">
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ResetPassword;
